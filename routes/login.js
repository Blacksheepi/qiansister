import express from 'express'
import passport from 'passport'
import user from '../models/user'

let router = express.Router();
/*passport.authenticate('local')*/
router.post('/', (req, res) => {
    res.json({msg: 'success'});
});
router.post('/register', async (req, res, next) => {
    let data = req.body;
    try {
        let id = await user.register(data);
        res.json({id});
    } catch (e) {
        res.json({msg: 'register failed!'});
    }

})

export default router;