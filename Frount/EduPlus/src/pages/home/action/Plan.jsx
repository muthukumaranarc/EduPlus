import './plan.css';
import arrow from "../../../assets/arrow.png";
import upload from "../../../assets/upload.png";
import { useOutletContext } from "react-router-dom";
import { useRef, useState } from 'react';
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";


function Plan() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const { deviceWidth } = useOutletContext();

    const [file, setFile] = useState(null);
    const [uploaded, setUploaded] = useState(false);
    const [text, setText] = useState("");

    const openFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setUploaded(true);

        if (selectedFile.type === "application/pdf") {
            setTimeout(() => {
                renderPdfPreview(selectedFile);
            }, 0);
        }
    };


    const renderPdfPreview = async (file) => {
        const fileURL = URL.createObjectURL(file);
        const pdf = await pdfjsLib.getDocument(fileURL).promise;

        const page = await pdf.getPage(1); // first page
        const viewport = page.getViewport({ scale: 1.2 });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
            canvasContext: context,
            viewport: viewport,
        }).promise;
    };

    const cancelFile = () => {
        setFile(null);
        setUploaded(false);
        setText("");

        // clear file input value
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // clear canvas (PDF)
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            ctx && ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };



    return (
        <>
            {deviceWidth > 768 && (
                <div className='ac-head' onClick={() => window.history.back()}>
                    <img src={arrow} alt="arrow" />
                    <p>Actions</p>
                </div>
            )}

            <div className={`plan ${uploaded ? "uploaded" : ""}`}>

                {/* Intro Section */}
                <div className="intro">
                    <h2>Study plan with tests</h2>
                    <p>
                        Upload your file or paste text below to instantly generate
                        your personalized study plan with tests.
                    </p>
                </div>

                {/* File Preview Card */}
                {uploaded && file && (
                    <div className="file-card">

                        {/* Cancel button */}
                        <button className="cancel-btn" onClick={cancelFile}>
                            ✕
                        </button>

                        <div className="file-preview">
                            {file.type.startsWith("image/") && (
                                <img src={URL.createObjectURL(file)} alt="preview" />
                            )}

                            {file.type === "application/pdf" && (
                                <canvas ref={canvasRef}></canvas>
                            )}
                        </div>

                        <div className="file-details">
                            <p><b>Name</b> : Study material</p>
                            <p><b>Size</b> : {(file.size / 1024).toFixed(1)} KB</p>
                            <p><b>Type</b> : {file.type || "file"}</p>
                        </div>
                    </div>
                )}

                {/* Input + Button */}
                <div className="query">
                    <input
                        type="text"
                        placeholder={uploaded ? "Add a text with it" : "Upload file and ask your query"}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <button onClick={!uploaded ? openFilePicker : () => { }}>
                        {!uploaded ? (
                            <>
                                <img src={upload} alt="Upload" />
                                <p>Upload</p>
                            </>
                        ) : (
                            <p>Send</p>
                        )}
                    </button>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
        </>
    );
}



export default Plan;
