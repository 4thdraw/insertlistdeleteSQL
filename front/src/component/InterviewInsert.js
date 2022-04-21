import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';
import $ from 'jquery';



function InsertInterview(props){
  
   const [message, setMessage ] = useState('기다려주세요.'); //에러출력 변수
   const [contentno, setNo ] = useState(null);
   let   updatano = useParams();
   const navigate = useNavigate();
   
   

  const modifyView = async (no) => { //글수정일경우 폼안의 데이터넣기
   

    if( Object.keys(updatano).length > 0){ //object객체의 값이 비어있지않다면
        setNo(parseInt(updatano.no)); // 수정일때만 재랜더링 데이터값을 가져와서 필드 채워넣기
        console.log( message, ' / ' , no , ' / ' ,typeof no);
        
        var modiefiyJson = { 
          no : no,
          crud : 'select',
          mapper : props.dbinfo.mapper,
          mapperid :'interviewList'
         }


        try{
        //  console.log(typeof modiefiyJson, modiefiyJson )
          axios.post('/api?type=interviewList', {
               headers : {
              "Content-Type": `application/json`
              },              
              body : modiefiyJson
  
          }).then( res => {               
                        
              try{                  
               // setMessage('데이터전달완료');
                console.log("수정데이터 : ", res.data[0] ) //데이터 콘솔에서 확인  
                // , 와 + 표현식은 결코 갖지않다
                $('#wr_subject').val(res.data[0].subject);
                $('#wr_content').val(res.data[0].content);
                 
              }
              catch(err){
                setMessage('DB데이터타입검수바람 ' +  err);
              }
  
          }).catch( err => {
            console.log('특정 no DB가져오기')
            setMessage('접속하였으나 처리하지 못함 ' +  err);
          })
         }
         catch(err){
          console.log('특정 no DB가져오기')
          setMessage('서버접속불가 ' +  err);
         } 
  
      }

    }
     




   const submitInterview = async (type, e) => { //버튼클릭시 실행
    
 

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
        console.log(typeof Json_data);

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

              setMessage('노드에 잘 접속되고 전달되었음');
              if(type === 'interviewInsert'){
                $('.formStyle [name]').val(''); 
              // 리액트는 기본적으로 랜더링을 2번함, 반드시 필드를 지워주어야 2번 실행되지않음
                 window.location.reload(); // 글쓰기와 글 보기가 다른 컴포넌트이고 같은  view에 노출될경우 새로고침
              }else{
                navigate("/")
              }
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
    submitInterview(props.dbinfo.botable, e)       
  }, [message])

  useEffect((e)=>{  //랜더링이후 실행과 message값이 변경할때마다 실행 
    modifyView(contentno)      
  }, [contentno])
  


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
          <Input type="text" name='wr_subject' id="wr_subject" />
        </FormGroup>
        <FormGroup>
          <Label for="exampleText">인터뷰내용</Label>
          <Input type="textarea" name="wr_content" id="wr_content" />
        </FormGroup>       
        </div>
        <FormGroup check className="agree">
          <Label check>
            <Input type="checkbox" id="agreeTerm" />{' '}
            <span>개인정보정책동의</span>
          </Label>
        </FormGroup>
        <Button onClick={e => { submitInterview(props.dbinfo.botable, e) }}>{ contentno !== null ?  '글수정' : '글쓰기'}</Button>
        
      </Form>
      
      <p> { message  }</p>
    </div>
  )

}

export default InsertInterview