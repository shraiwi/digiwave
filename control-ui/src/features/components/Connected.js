import React, { useState } from "react";

const Connected = () => {
    // TODO: receive information about phones connected
    const phones = useState(0);
    return (
        <h1>There are {phones} phones connected</h1>
    )
}

export default Connected;