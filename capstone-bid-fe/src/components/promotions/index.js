import { Box, Slide } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MessageText, PromotionsContainer } from "../../style/promotions";


const message = ["Chúng tôi tự hào là một trong những nhà đấu giá lớn nhất tại Việt Nam",
 "Online Bids luôn là đơn vị tiên phong ứng dụng công nghệ thông tin vào hoạt động đấu giá.","Với phương châm hoạt động: “Đem lại hiệu quả kinh tế vượt trội”","Chúng tôi hy vọng sẽ làm hài lòng Quý Khách và mong được đồng hành cùng Quý Khách hàng trong quá trình phát triển."]

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
                    <MessageText align="center"> 
                        {message[messageIndex]}
                    </MessageText>
                </Box>
            </Slide>

        </PromotionsContainer>
    );
}