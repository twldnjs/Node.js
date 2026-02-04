import express from 'express';
import conn from '../mariadb.js';

const router = express.Router();

router.use(express.json());

router
  .route('/')
  .get(async (req, res) => {
    // 채널 전체 조회
    const { userId } = req.body;

    try {
      const sql = `SELECT * FROM channels WHERE user_id = ?`;
      const [results] = await conn.query(sql, userId);
      if (results.length) res.status(200).json(results);
      else {
        notFoundChannel(res);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러' });
    }
    res.status(400).end();
  })
  .post(async (req, res) => {
    // 채널 개별 생성 = db 에 저장
    const { name, userId } = req.body;
    try {
      if (name && userId) {
        const sql = 'INSERT INTO channels (name, user_id) VALUES (?, ?)';
        const values = [name, userId];
        const [results] = await conn.query(sql, values);
        if (results.length) res.status(201).json(results);
      } else {
        res.status(400).json({ message: '요청 값이 잘못되었습니다.' });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러' });
    }
  });

router
  .route('/:id')
  .get(async (req, res) => {
    // 채널 개별 조회
    let { id } = req.params;
    id = parseInt(id);

    try {
      const sql = `SELECT * FROM channels WHERE id = ?`;
      const [results] = await conn.query(sql, id);
      if (results.length) res.status(200).json(results);
      else {
        notFoundChannel(res);
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: '서버 에러' });
    }
  })
  .put((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var chanel = db.get(id);
    if (chanel) {
      const newTitle = req.body.channelTitle;
      const oldTitle = chanel.channelTitle;

      chanel.channelTitle = newTitle;

      db.set(id, chanel);
      res.status(200).json({
        message: `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle} -> 수정 ${newTitle}`,
      });
    } else {
      notFoundChannel();
    }
  }) // 채널 개별 수정
  .delete((req, res) => {
    let { id } = req.params;
    id = parseInt(id);

    var chanel = db.get(id);

    if (chanel) {
      db.delete(id);
      res.status(200).json({
        message: `${chanel.channelTitle}이 정상적으로 삭제 되었습니다.`,
      });
    } else {
      notFoundChannel();
    }
  }); // 채널 개별 삭제

function notFoundChannel(res) {
  res.status(404).json({
    message: '채널 정보를 찾을 수 없습니다.',
  });
}

export default router;
