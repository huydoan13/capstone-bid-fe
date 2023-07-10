import { Box, Slide } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MessageText, PromotionsContainer } from "../../style/promotions";


const message = ["01 quyền sử dụng đất tại thửa đất số 172 d, tờ bản đồ số: 25, diện tích 155,0m2 có địa chỉ tại:",
    "Khu Ao Sông, thôn Dương Ố, xã Phong Khê, huyện Yên Phong, tỉnh Bắc Ninh"]

export default function Promotions() {
    const contaiverRef = useRef();
    const [messageIndex, setMessageIndex] = useState(0);
    const [show, setShow] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setShow(false)
        }, 3000)
        const intervalId = setInterval(() => {
            setMessageIndex(i => (i + 1) % message.length)

            setShow(true);
            setTimeout(() => {
                setShow(false)
            }, 3000)
        }, 4000);
        return () => {
            clearInterval(intervalId);
        }
    }, []);
    return (
        <PromotionsContainer ref={contaiverRef}>
            <Slide
                container={contaiverRef.current}
                direction={show ? "left" : "up"}
                in={show}
                timeout={{
                    enter: 500,
                    exit: 100
                }}
            >
                <Box display={"flex"} justifyContent="center" alignItems={"center"}>
                    <MessageText>
                        {message[messageIndex]}
                    </MessageText>
                </Box>
            </Slide>

        </PromotionsContainer>
    );
}