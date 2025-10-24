import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

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

