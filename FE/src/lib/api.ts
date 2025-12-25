import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const N8N_WEBHOOK = (import.meta as any).env?.VITE_N8N_WEBHOOK_URL as string | undefined;

const api = axios.create({
	baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export async function register(email: string, password: string, fullName: string) {
	const { data } = await api.post('/auth/register', { email, password, fullName });
	return data;
}

export async function login(email: string, password: string) {
	const { data } = await api.post('/auth/login', { email, password });
	return data;
}

export async function diagnose(payload: Record<string, number>) {
	const { data } = await api.post('/diagnosis', payload);
	return data;
}

export async function history() {
	const { data } = await api.get('/diagnosis/history');
	return data;
}

export async function chatWithBot(message: string) {
	if (!N8N_WEBHOOK) {
		throw new Error('Missing VITE_N8N_WEBHOOK_URL');
	}
	const { data } = await axios.post(
		N8N_WEBHOOK,
		{ text: message },
		{ headers: { 'Content-Type': 'application/json' } }
	);
	return data;
}
export async function sendEmail(toEmail: string, prediction: number, inputData: any) {
    const res = await fetch(`${API_URL}/email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toEmail, prediction, inputData }),
    });
    if (!res.ok) throw new Error('Gửi email thất bại');
    return res.json();
}
