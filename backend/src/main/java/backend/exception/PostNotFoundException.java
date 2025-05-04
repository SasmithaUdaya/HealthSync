package backend.exception;


//validator class of the post
public class PostNotFoundException extends RuntimeException {
    public PostNotFoundException(String id){
        super("could not find id " + id);
    }
//    public PostNotFoundException(String message){
//        super(message);
//    }
}
