import { useEffect, useState } from "react";
import { questions_mbti, questions_options } from "./question";
import MbtiTypeResult from "./mbti_type_result";
import myImage from "./assets/icons8-tree-80.png";
// `window.Kakao`를 사용하기 위해 window 객체에서 Kakao를 가져옵니다.
const { Kakao } = window;

console.log(">>>> MBIT");
const KAKAO_KEY = import.meta.env.VITE_KAKAO_API;

export default function MBTITest() {
  useEffect(() => {
    // init 해주기 전에 clean up을 해준다.
    Kakao.cleanup();
    // 자신의 js 키를 넣어준다.
    Kakao.init(KAKAO_KEY);
    // 잘 적용되면 true를 뱉는다.
    console.log(Kakao.isInitialized());
  }, []);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (choice) => {
    const key = choice === "그렇다" ? "YES" : "NO";
    const type = questions_mbti[currentQuestion][key];

    setAnswers((prev) => ({ ...prev, [type]: prev[type] + 1 }));

    if (currentQuestion < questions_mbti.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const initialAnswers = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers(initialAnswers);
    setShowResult(false);
  };

  const getMBTIResult = () => {
    const types = [
      ["E", "I"],
      ["S", "N"],
      ["T", "F"],
      ["J", "P"],
    ];

    return types.map(([a, b]) => (answers[a] >= answers[b] ? a : b)).join("");
  };

  const shareKakao = () => {
    const result = getMBTIResult();
    const resultUrl = `http://react.koiforever.p-e.kr/result?mbti=${result}`; // 결과를 포함한 URL

    Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: "MBTI 테스트 결과",
        description: `당신의 MBTI 유형은 ${result}입니다!`,
        imageUrl:
          "https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
        link: {
          mobileWebUrl: resultUrl, // 결과 값을 포함한 URL 공유
        },
      },
      buttons: [
        {
          title: "MBTI 결과 보기",
          link: {
            mobileWebUrl: resultUrl,
          },
        },
      ],
    });
  };

  const sendEmail = () => {
    const result = getMBTIResult();
    window.location.href = `mailto:?subject=MBTI 테스트 결과&body=내 MBTI 결과는 ${result} 입니다!`;
  };

  return (
    <div className="flex flex-col items-center p-20 gap-10 md:w-3/4 w-[90%] mx-auto bg-slate-50 h-screen">
      <h1 className="text-3xl font-bold mb-4 flex gap-4 justify-center items-center">
        <img src={myImage} alt="icon image" width={50} height={50} />{" "}
        <p>MBTI 테스트 </p>
        <div className="text-xl">(문항 : {questions_mbti.length}개)</div>
      </h1>

      {showResult ? (
        <div className="border border-blue-500 p-10 rounded-lg bg-white flex flex-col justify-center items-center gap-4  w-[100%] h-[60%] md:h-[50%] ">
          <h2 className="text-2xl md:text-3xl font-semibold text-center">
            당신의 MBTI 유형은?{" "}
            <span className="font-bold text-green-800">{getMBTIResult()}</span>
          </h2>
          <div className="text-center text-xl md:text-2xl">
            <MbtiTypeResult mbti={getMBTIResult()} />
          </div>
          <div className="mt-10 flex flex-col xg:flex-row md:flex-row  gap-6 justify-center items-center">
            <button
              onClick={shareKakao}
              className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 "
            >
              카카오톡 공유하기
            </button>
            {/* <KakaoShare /> */}
            <button
              onClick={sendEmail}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 "
            >
              이메일로 전송하기
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-400 text-white py-2 px-10 rounded-lg hover:bg-gray-600"
            >
              다시 하기
            </button>
          </div>
        </div>
      ) : (
        <div className="border border-blue-500 p-10 rounded-lg bg-white flex flex-col justify-center items-center gap-6 w-[100%] h-[60%] md:h-[50%] ">
          <p className="text-2xl mb-4 h-16">
            {questions_mbti[currentQuestion].question}
          </p>
          <div className="flex gap-4">
            {questions_options[0].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700 w-32"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
      {!showResult && (
        <div className="flex justify-center w-80 mt-4 gap-4">
          <button
            onClick={handlePrev}
            className="bg-gray-400 text-white py-2 px-10 rounded-lg hover:bg-gray-600"
            disabled={currentQuestion === 0}
          >
            이전
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-400 text-white py-2 px-10 rounded-lg hover:bg-gray-600 "
          >
            다시 하기
          </button>
        </div>
      )}
    </div>
  );
}
