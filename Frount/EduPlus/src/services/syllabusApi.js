import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export async function uploadSyllabus(data) {
    const res = await axios.post(`${baseURL}/syllabus/upload`, data, {
        withCredentials: true,
    });
    return res.data;
}

export async function getAllSyllabus() {
    const res = await axios.get(`${baseURL}/syllabus/get-all`, {
        withCredentials: true,
    });
    return res.data;
}

export async function getSubjects() {
    const res = await axios.get(`${baseURL}/syllabus/get-subjects`, {
        withCredentials: true,
    });
    return res.data;
}

export async function deleteSyllabus(id) {
    const res = await axios.delete(`${baseURL}/syllabus/delete/${id}`, {
        withCredentials: true,
    });
    return res.data;
}
