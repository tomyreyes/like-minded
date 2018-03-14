const router = express.Router()

router.get('/login', (req, res)=>{
    //this will retrieve the sent login data from frontend 
    //this will handle google login so i need to set this up with passport
})
router.get('/logout', (req, res)=>{
    //the process of logging out is handled by passport as well 
})

module.exports = router 