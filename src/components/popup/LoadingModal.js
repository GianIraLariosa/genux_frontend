import { Box, Modal } from "@mui/material";
import { Atom } from "react-loading-indicators";

const LoadingModal = ({ loading }) => {
    return(
        <>
            <Modal
                open={loading}
                aria-labelledby="loading-modal"
                aria-describedby="loading-modal-description"
                BackdropProps={{
                    style: {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the opacity here
                    },
                  }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,  // Adjust the width of the box
                        bgcolor: 'background.paper',
                        p: 4,  // Padding inside the box
                        textAlign: 'center',  // Center the content inside the box
                        borderRadius: 4,  // Add rounded corners
                        boxShadow: '10px 10px 3px rgba(0, 0, 0, 0.2)',  // Custom box shadow
                    }}
                >
                    <Atom color="#41C9E2" size="medium" text="" textColor="" />
                    <div>
                        Generating UX
                    </div>
                </Box>
            </Modal>
        </>
    );
}

export default LoadingModal;