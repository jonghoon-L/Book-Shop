import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

interface Props {
    children : React.ReactNode;
    toggleButton : React.ReactNode;
    isopen?: boolean;    
}

function Dropdown({children, toggleButton, isopen = false} : Props) {
    const [open, setopen] = useState(isopen);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutsideClick(event : MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setopen(false); // 외부  클릭 시 닫음
            }
        }

        document.addEventListener('mousedown', handleOutsideClick);

        return() => {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
    }, [dropdownRef])

    return(
        <DropdownStyle $open={open} ref={dropdownRef}>
            <button className="toggle" onClick={() => setopen(!open)}>{toggleButton}</button>
            {open && <div className="panel">{children}</div>}
        </DropdownStyle>
    )
}

interface DropdownStyleProps {
    $open : boolean;
}

const DropdownStyle = styled.div<DropdownStyleProps>`
    position : relative;

    button {
        background : none;
        border : none;
        cursor : pointer;
        outline : none;

        svg {
            width : 30px;
            height : 30px;
            fill : ${({theme, $open}) => $open ? theme.color.primary : theme.color.text};
        }
    }

    .panel {
        position : absolute;
        top : 40px;
        right : 0;
        padding : 16px;
        background : #fff;
        box-shadow : 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius : ${({theme}) => theme.borderRadius.default};
        z-index : 10;
    }
`;

export default Dropdown;
