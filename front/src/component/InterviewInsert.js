import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import $ from 'jquery';



function InsertInterview(props){ //글쓰기와 글수정을 함께 처리하는 컴포넌트
  
   const [message, setMessage ] = useState('기다려주세요.'); 
   //랜더링제어변수
   const [contentno, setNo ] = useState(null);
   //수정과 글쓰기를 구분하는 변수
   
  

   let   updatano = useParams();
   //주소창변수읽어내는 메서드
   const navigate = useNavigate();
   //메서드 글수정 및 글쓰기이후  라우트자동이동



   const submitInterview = async (type, no,  e) => { 

    if( Object.keys(updatano).length > 0){ 
      //절대 이 표현식이 submitInterview 함수 밖에 있으면 안됨
      // useState로 선언된 메서드는 값이 수정될때마다 랜더링이 되니깐
      // message로 제어되는 함수안에 있어야 너무 많은 랜더링이 일어나지않는다.
      setNo(parseInt(updatano.no));
      // useState 함수자체가 비동기적으로 실행되어서 여기의 핵심키워드가 있다면
      // 그 키워드가 핵심이 되는 실행문이라면 반드시 setTimeout으로 시간을 끌어준다.
      setTimeout( function(){

            axios.post('/api?type=interviewList', {          
                            
              body :{ 
                      no : no, // 여기서 중요 절대 contentno로 하면 안됨
                      crud : 'select',
                      mapper : props.dbinfo.mapper,
                      mapperid :'interviewList'
              }
          }
          ).then( (res) => {
            // 수정의 경우 res.data[0] 데이터레코드가 딱 하나이므로 [0]으로 접근
            $('#wr_subject').val(res.data[0].subject)
            $('#wr_content').val(res.data[0].content)
            //여기서 setMessage 함수실행 절대하면안됨    -> 데이터가 차례대로 들어올때마다 랜더링을 하게 됨     
            //제이쿼리 선택자로 처리하면 재더링부담은 없다.
            //value값을 리턴에 직접 처리할 경우 랜더링처리를 해아하므로 
            //useState를 꼭 써야만한다.!!!
                
          }
          ).catch(
            err =>{
              setMessage('서버전송에러'+err)
            }
          )
      }, 1)
    }
     

    const  fnValidate = () =>{ 
      if(!$('#agreeTerm').is(':checked')){ 
          setMessage("동의하시게나");
          return false;
      } 
      if($('#wr_subject').val() == '' ){
        $('#wr_subject').focus();
        setMessage("제목넣기");       
        return false;
      } 
      if($('#wr_content').val() == '' ){
        $('#wr_content').focus();
        setMessage("내용넣기");       
        return false;
    }                  
      return true;  
    }


    if( fnValidate() ){      
      

    var jsonstr = decodeURIComponent($("[name='"+type+"']").serialize());
    var Json_data = JSON.stringify(jsonstr).replace(/\&/g, '\",\"')    
        Json_data = '{' + Json_data.replace(/=/gi, '\":\"') + '}'         
        console.log(typeof Json_data, contentno);

      try{
          axios.post('/api?type='+type,
      //아래의 내용을 post전송한다. req.body객체임
          {         
            headers : {
            "Content-Type": `application/json`
            },
            body : Json_data
          })
          .then( result =>  {  
            //console.log(result); 
            if(result.data == 'succ')  {

              
              setNo(null); // 글수정이 완료되었으므로 
              setTimeout(function(){

                if( contentno == null ){                
                  $('.formStyle [name]').val('');              
                  setMessage('노드에 잘 접속되고 전달되었음');  
                  window.location.reload(); 
                }else{
                  navigate("/")
                }

              }, 1)
             
            } else{
              console.log('쿼리 혹은 xml 접속문제')
            }

              }
          ).catch(
            (err) => { 
              console.log('답을 못가져옴 서버어느파일인지 조사해야함 '+err )
            }
          )  
        
        }
      catch(err){
        console.log('서버연결도 안됨 '+err )

      }
    }
    
  } //// submitInterview

  
  useEffect((e)=>{  //랜더링이후 실행과 message값이 변경할때마다 실행 
   
      submitInterview(props.dbinfo.botable, contentno , e)
   
  }, [message])


  


  return (
    <div className={props.dbinfo.botable + " container py-5"}>
      <h3 className='title'>  {  contentno !== null && "["+contentno +"] 게시글" }   {'인터뷰' +props.dbinfo.titlenm}</h3>
      <Form action=""  method='post' name={props.dbinfo.botable}>       
        <FormGroup>
          { contentno !== null && <input type='hidden' name='no' value={ contentno || '' } />}
          <input type='hidden' name='crud' value={props.dbinfo.crud} />
          <input type='hidden' name='mapper' value={props.dbinfo.mapper} />
          <input type='hidden' name='mapperid' value={props.dbinfo.mapperid} />
        </FormGroup>
        <div className='formStyle'>
        <FormGroup>
          <Label for="wr_subject">인터뷰제목</Label>
          <Input type="text" name='wr_subject' id="wr_subject"   />
        </FormGroup>
        <FormGroup>
          <Label for="exampleText">인터뷰내용</Label>
          <Input type="textarea" name="wr_content" id="wr_content"  />
        </FormGroup> 
        <FormGroup id='checkDate'>
          <Label for="checkDate0">마케팅</Label>
          <Input type='checkbox' value='0' id="checkDate0" />
          <Label for="checkDate1">퍼블리싱</Label>
          <Input type='checkbox' value='1' id="checkDate1" />
          <Label for="checkDate2">디자인</Label>
          <Input type='checkbox' value='2' id="checkDate2" />
          <Label for="checkDate3">기타</Label>
          <Input type='checkbox' value='3' id="checkDate3" />          
        </FormGroup>          
        </div>
        <FormGroup check className="agree">
          <Label check>
            <Input type="checkbox" id="agreeTerm" />{' '}
            <span>개인정보정책동의</span>
          </Label>
        </FormGroup>
        <Button onClick={e => { submitInterview(props.dbinfo.botable,contentno, e) }}>{ contentno !== null ?  '글수정' : '글쓰기'}</Button>
        
      </Form>
      
      <p> { message  }</p>
    </div>
  )

}

export default InsertInterview