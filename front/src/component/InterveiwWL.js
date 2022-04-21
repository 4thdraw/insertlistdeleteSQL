import React, { Component } from 'react';
import InterviewList from './InterviewList';
import InterviewInsert from './InterviewInsert';

class InterveiwWL extends Component {
    constructor(props) {
        super(props);

    }


    componentDidMount() {

    }

   

    render() {
        return (
            <div>
<InterviewList dbinfo={ {         
          titlenm : '아마존 인터뷰목록', 
          botable : 'interviewList',
          crud : 'select',
          mapper : 'introduceSQL',
          mapperid : 'interviewList'
          }
          }></InterviewList>
<InterviewInsert dbinfo={ {         
          titlenm : '리액트스트랩 모듈로 만든 폼 아마존과연동', 
          botable : 'interviewWrite',
          crud : 'insert',
          mapper : 'introduceSQL',
          mapperid : 'interviewInsert'
          }
          }></InterviewInsert>
            </div>
        );
    }
}



export default InterveiwWL;

