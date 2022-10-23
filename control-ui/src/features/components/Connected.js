import { useSelector } from "react-redux";
import { selectCount } from "../counter/counterSlice";

const Connected = () => {
    // TODO: receive information about phones connected
    const phones = useSelector(selectCount);
    return (
        <h1>There are {phones} phones connected</h1>
    )
}

export default Connected;