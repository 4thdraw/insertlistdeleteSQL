import React from 'react';
import { Route, Routes } from 'react-router-dom';
import InterviewWL from './component/InterveiwWL';
import InterviewInsert from './component/InterviewInsert';



function App() {
  return (
    <div className="Wrap">
           
      
      <Routes>
        <Route path='/' element={<InterviewWL></InterviewWL>}></Route>
       
        <Route path='/interviewModify/:no' element={<InterviewInsert dbinfo={ {         
          titlenm : '글수정', 
          botable : 'interviewModify',
          crud : 'update',
          mapper : 'introduceSQL',
          mapperid : 'interviewModify'
          }
          }></InterviewInsert>}></Route> 
      </Routes>     
    </div>
  );
}

export default App;
