import express from 'express';
const router = express.Router();

import conn from '../mariadb.js';

router.use(express.json()); // http 외 모듈 'json' (json 을 body 에 꺼내서 쓰기위한 모듈)

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: '이메일 또는 비밀번호를 입력해주세요.' });
  }

  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];
    const [results] = await conn.query(sql, values);
    const loginUser = results[0];

    if (!loginUser) {
      return res.status(404).json({ message: '회원 정보가 없습니다.' });
    }
    if (loginUser.password !== password) {
      return res.status(400).json({ message: '비밀번호가 틀렸습니다.' });
    }
    return res.status(200).json({
      message: `${loginUser.name}님 로그인 되었습니다.`,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: '서버 에러 발생' });
  }
});

// 회원 가입
router.post('/join', async (req, res) => {
  const { email, name, password, contact } = req.body;

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: '입력 값을 다시 확인해주세요.' });
  }

  try {
    const sql =
      'INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)';
    const values = [email, name, password, contact];

    const [results] = await conn.query(sql, values);
    res.status(201).json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: '서버 에러' });
  }
});

// 회원 개별 조회
router.get('/users', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'EMAIL 정보 필요' });
  }
  try {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const values = [email];

    const [results] = await conn.query(sql, values);
    if (results.affectedRows === 0) {
      res.status(404).json({
        message: `회원 정보가 없습니다.`,
      });
    }
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: '서버 에러' });
  }
});

// 회원 개별 탈퇴
router.delete('/users', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'EMAIL 정보 필요' });
  }

  try {
    const sql = 'DELETE FROM users WHERE email = ?';
    const values = [email];

    const [result] = await conn.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: '삭제할 유저가 없습니다.' });
    }

    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: '서버 에러' });
  }
});

export default router;
