// 채팅 메시지를 표시할 DOM
const chatMessages = document.querySelector('#chat-messages');
// 사용자 입력 필드
const userInput = document.querySelector('#user-input input');
// 전송 버튼
const sendButton = document.querySelector('#user-input button');
// 발급받은 OpenAI API 키를 변수로 저장
const apiKey = process.env.OPENAI_API_KEY;
// OpenAI API 엔드포인트 주소를 변수로 저장
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

function addMessage(sender, message) {
  // 새로운 div 생성
  const messageElement = document.createElement('div');
  // 생성된 요소에 클래스 추가
  messageElement.className = 'message';
  // 채팅 메시지 목록에 새로운 메시지 추가
  messageElement.textContent = `${sender}: ${message}`;
  chatMessages.prepend(messageElement);
}

// ChatGPT API 요청
async function fetchAIResponse(prompt) {
  // API 요청에 사용할 데이터
  const requestData = {
    model: 'gpt-3.5-turbo', // 사용할 AI 모델
    messages: [
      {
        role: 'user', // 메시지 역할을 user로 설정
        content: prompt, // 사용자가 입력한 메시지
      },
    ],
    temperature: 0.8, // 모델의 출력 다양성
    max_tokens: 150, // 응답받을 메시지 최대 토큰(단어) 수 설정
    top_p: 1, // 토큰 샘플링 확률을 설정
    frequency_penalty: 0.5, // 일반적으로 나오지 않는 단어를 억제하는 정도
    presence_penalty: 0.5, // 동일한 단어나 구문이 반복되는 것을 억제하는 정도
    stop: ['Human'], // 생성된 텍스트에서 종료 구문을 설정
  };

  // API 요청 후 응답 처리
  try {
    const response = await axios.post(apiEndpoint, requestData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const aiResponse = response.data.choices[0].message.content;
    return aiResponse;
  } catch (error) {
    console.error('OpenAI API 호출 중 오류 발생:', error);
    return 'OpenAI API 호출 중 오류 발생';
  }
}

// 전송 버튼 클릭 이벤트 처리
sendButton.addEventListener('click', async () => {
  // 사용자가 입력한 메시지
  const message = userInput.value.trim();
  // 메시지가 비어있으면 리턴
  if (message.length === 0) return;
  // 사용자 메시지 화면에 추가
  addMessage('나', message);
  userInput.value = '';
  // ChatGPT API 요청 후 답변을 화면에 추가
  const aiResponse = await fetchAIResponse(message);
  addMessage('챗봇', aiResponse);
});

// 사용자 입력 필드에서 Enter 키 이벤트를 처리
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendButton.click();
  }
});

// // axios와 dotenv 패키지 가져오기
// const axios = require('axios');

// // DOMContentLoaded 이벤트 리스너 추가
// document.addEventListener('DOMContentLoaded', async function () {
//   const sendBtn = document.getElementById('sendBtn');
//   const msgInput = document.getElementById('msg');
//   const discussionList = document.querySelector('.discussion');

//   sendBtn.addEventListener('click', async function () {
//     const msg = msgInput.value;
//     addToDiscussion('self', msg);

//     // async function main() {
//     //   const completion = await openai.chat.completions.create({
//     //     messages: [{ role: "system", content: "string" }],
//     //     model: "gpt-3.5-turbo",
//     //   });

//     //   console.log(completion.choices[0]);

//     // 서버 측에서 API 호출 및 응답 처리
//     try {
//       const response = await callChatGPT(msg);
//       addToDiscussion('other', response);
//     } catch (error) {
//       console.error('Error calling ChatGPT API:', error);
//       alert('ChatGPT API 호출 중 오류가 발생했습니다.');
//     }

//     msgInput.value = '';
//     msgInput.focus();
//   });

//   async function callChatGPT(prompt) {
//     try {
//       // 서버 측에서 API 호출 및 응답 처리
//       const response = await axios.post(
//         '/chatGPT', // 서버에서 API 호출
//         { prompt },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       return response.data.response;
//     } catch (error) {
//       console.error('Error calling ChatGPT API:', error);
//       throw error;
//     }
//   }

//   function addToDiscussion(writer, msg) {
//     const li = document.createElement('li');
//     li.className = writer;

//     const div = document.createElement('div');
//     div.className = 'message';

//     const p = document.createElement('p');
//     p.textContent = msg;

//     div.appendChild(p);
//     li.appendChild(div);

//     discussionList.appendChild(li);
//   }
// });
