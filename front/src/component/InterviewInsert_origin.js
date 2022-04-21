import { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios'
import $ from 'jquery';


function InsertInterview(props){
  
   const [message, setMessage ] = useState(''); //에러출력 변수

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
              $('.formStyle [name]').val('');

            } else{
              setMessage('쿼리 혹은 xml 접속문제')
            }

              }
          ).catch(
            (err) => { 
              setMessage('답을 못가져옴 서버어느파일인지 조사해야함 '+err )
            }
          )  
        
        }
      catch(err){
        setMessage('서버연결도 안됨 '+err )

      }
    }
    
  } //// submitInterview

  
  useEffect((e)=>{      
    submitInterview(props.dbinfo.botable, e)
  }, [message])
    

  return (
    <div className={props.dbinfo.botable + " container py-5"}>
      <h3 className='title'>{props.dbinfo.titlenm}</h3>
      <Form action=""  method='post' name={props.dbinfo.botable}>       
        <FormGroup>
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
        <Button onClick={e => { submitInterview(props.dbinfo.botable, e) }}>글쓰기</Button>
      </Form>
      
      <p>{ message  }</p>
    </div>
  )

}

export default InsertInterview