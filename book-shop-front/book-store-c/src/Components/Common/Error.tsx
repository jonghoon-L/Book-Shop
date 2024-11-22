import { useRouteError } from "react-router-dom";

interface RouteError {
    statusText ?: string;
    message ?: string;
}

function Error() {
    const error = useRouteError() as RouteError;

    return(
        <div>
            <h1> 오류 발생 </h1>
            <p> 다음과 같은 오류 발생 </p>
            <p> {error.statusText || error.message} </p>
        </div>
    )
}

export default Error;