import { ReactNode } from "react";
import styled from "styled-components";

interface ScrollViewProps {
    children: ReactNode;
    className?: string;
}

export default function ScrollView({ children, className }: ScrollViewProps) {
    return <ScrollContainer className={className}>{children}</ScrollContainer>;
}

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
`