const errorHandler=(error,req,res,next)=>{
    console.log(error.message);
  return res.status(500).send(error.message);
}
export {errorHandler};