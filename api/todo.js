import db from '../../config/database';

export default function handler(req, res) {
    if(req.method === 'GET') {
        db.query('SELECT * FROM todos', (err, results) => {
            if(err) return res.status(500).json({error: err});
            res.status(200).json({data: results});
        });
    }
    // POST, PUT, DELETE similar
}
