const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

// users의 정보를 확인하신 후에 로그인 요청을 진행해주세요.
// server.js 파일 내에 총 5가지의 문제가 존재합니다.
// 문제의 요구사항을 꼼꼼히 읽어보신 후에 과제를 진행해주세요.
const users = [
    {
        user_id: "oz_user1",
        user_password: "1234",
        user_name: "김오즈",
        user_info: "서울에 거주하는 김오즈입니다.",
    },
    {
        user_id: "oz_user2",
        user_password: "4567",
        user_name: "박코딩",
        user_info: "부산에 거주하는 박코딩입니다.",
    },
    {
        user_id: "oz_user3",
        user_password: "7890",
        user_name: "이쿠키",
        user_info: "경기에 거주하는 이쿠키입니다.",
    },
    {
        user_id: "oz_user4",
        user_password: "1357",
        user_name: "최노드",
        user_info: "제주에 거주하는 최노드입니다.",
    },
];

const app = express();

app.use(
    cors({
        // ⭐️ origin에 설정되어 있는 포트번호를 본인의 라이브서버 포트번호로 변경해주세요.
        origin: ["http://127.0.0.1:5500", "http://localhost:3000"],
        methods: ["OPTIONS", "POST", "GET", "DELETE"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());

// 1️⃣. 요구사항에 맞도록 session 옵션을 설정해 주세요. (총 4가지)
app.use(
    session({
        // 암호화, 열쇠 역할을 하는 문자열 설정
        secret: "session_secret",
        // 요청이 들어왔을 때 변경되는 사항이 없는 경우 저장하지 않도록 설정
        resave: false,
        // 요청이 들어왔을 때 내용이 비어있는 경우 저장하지 않도록 설정
        saveUninitialized: false,
        // 쿠키 이름을 session_id로 변경
        name: "session_id",
    })
);

// POST 요청 (로그인 요청시 보내는 메소드)
app.post("/", (req, res) => {
    // 2️⃣. 요청 바디에서 전달받은 값을 구조분해 할당을 사용하여 관리하세요.
    const {userId, userPassword} = req.body;
    // 3️⃣. (find 메서드를 사용하여) users의 정보와 사용자가 입력한 정보를 비교하여 일치하는 회원이 존재하는지 확인하는 로직을 작성하세요.
    const userInfo = users.find(el => el.user_id === userId && el.user_password === userPassword);

    if (!userInfo) {
        res.status(401).send("로그인 실패");
    } else {
        // 유저가 존재하는 경우 user의 id 정보를 세션에 저장
        req.session.userId = userInfo.user_id;
        console.log(req.session.userId, "세션저장 post");
        res.send("⭐️세션 생성 완료!");
    }
});

// GET 요청
app.get("/", (req, res) => {
    console.log("세션에 저장된 userId:", req.session.userId); // 세션 정보 확인
    const userInfo = users.find(el => el.user_id === req.session.userId);
    // json 형식으로 내보내기
    console.log(userInfo);
    return res.json(userInfo);
});

// DELETE 요청
app.delete("/", (req, res) => {
    // 4️⃣. 세션 내 정보를 삭제하는 메소드를 작성하세요.
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("세션 종료 실패");
        }
        res.clearCookie("connect.sid"); // 세션 쿠키도 삭제
        res.send("로그아웃 성공");
    });
});

app.listen(3000, () => console.log("서버 실행 ..."));
