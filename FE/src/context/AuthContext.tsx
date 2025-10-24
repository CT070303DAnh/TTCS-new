import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
	token: string | null;
	login: (token: string) => void;
	logout: () => void;
	isAuthenticated: boolean;
	userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decode JWT token to get user email
function decodeToken(token: string): string | null {
	try {
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(
			atob(base64)
				.split('')
				.map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
				.join('')
		);
		const payload = JSON.parse(jsonPayload);
		return payload.sub || null; // JWT 'sub' claim contains email
	} catch (e) {
		return null;
	}
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [userEmail, setUserEmail] = useState<string | null>(null);

	useEffect(() => {
		const saved = localStorage.getItem('token');
		if (saved) {
			setToken(saved);
			setUserEmail(decodeToken(saved));
		}
	}, []);

	const login = (newToken: string) => {
		localStorage.setItem('token', newToken);
		setToken(newToken);
		setUserEmail(decodeToken(newToken));
	};

	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUserEmail(null);
	};

	return (
		<AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token, userEmail }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error('useAuth must be used within AuthProvider');
	return context;
}

