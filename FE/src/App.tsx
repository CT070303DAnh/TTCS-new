import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { login, register, diagnose, history } from './lib/api';
import { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { diagnosisFields, getDefaultFormValues } from './utils/diagnosisFields';
import { BMICalculator } from './components/BMICalculator';
import { generateHealthAdvice } from './utils/healthAdvice';

function Layout({ children }: { children: React.ReactNode }) {
	const { isAuthenticated, logout, userEmail } = useAuth();
	const nav = useNavigate();

	const handleLogout = () => {
		logout();
		nav('/');
	};

	// Get display name from email (take part before @)
	const displayName = userEmail ? userEmail.split('@')[0] : '';

	return (
		<div className="min-h-screen gradient-bg flex flex-col">
			<header className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
				<div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
					<Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:from-primary-700 hover:to-primary-900 transition-all transform hover:scale-105">
						🩺 Diabetes Care
					</Link>
					<nav className="flex items-center gap-6">
						{isAuthenticated && (
							<>
								<Link to="/diagnosis" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
									<span>Chẩn đoán</span>
									<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
								</Link>
								<Link to="/history" className="text-gray-700 hover:text-primary-600 font-medium transition-colors relative group">
									<span>Lịch sử</span>
									<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all group-hover:w-full"></span>
								</Link>
								<div className="flex items-center gap-3 pl-3 border-l-2 border-gray-200">
									<div className="flex items-center gap-2 bg-gradient-to-r from-primary-50 to-primary-100 px-3 py-1.5 rounded-full">
										<div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
											{displayName.charAt(0).toUpperCase()}
										</div>
										<span className="text-sm font-semibold text-primary-800 max-w-[120px] truncate" title={userEmail || ''}>
											{displayName}
										</span>
									</div>
									<button onClick={handleLogout} className="text-gray-700 hover:text-red-600 font-medium transition-colors hover:scale-105 transform">
										🚪
									</button>
								</div>
							</>
						)}
						{!isAuthenticated && (
							<>
								<Link to="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
									Đăng nhập
								</Link>
								<Link to="/register" className="btn-primary">
									Đăng ký
								</Link>
							</>
						)}
					</nav>
				</div>
			</header>
			<main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">{children}</main>
			<footer className="bg-gradient-to-r from-primary-800 to-primary-900 text-white py-8 mt-12">
				<div className="max-w-6xl mx-auto px-4">
					<div className="grid md:grid-cols-3 gap-8 mb-6">
						<div>
							<h3 className="text-xl font-bold mb-3 flex items-center gap-2">
								🩺 Diabetes Care
							</h3>
							<p className="text-primary-100 text-sm leading-relaxed">
								Hệ thống chẩn đoán nguy cơ tiểu đường sử dụng AI, giúp bạn theo dõi sức khoẻ hiệu quả.
							</p>
						</div>
						<div>
							<h4 className="font-semibold mb-3 text-primary-100">Liên kết</h4>
							<ul className="space-y-2 text-sm">
								<li><Link to="/" className="text-primary-200 hover:text-white transition-colors">🏠 Trang chủ</Link></li>
								<li><Link to="/diagnosis" className="text-primary-200 hover:text-white transition-colors">🏥 Chẩn đoán</Link></li>
								<li><Link to="/history" className="text-primary-200 hover:text-white transition-colors">📊 Lịch sử</Link></li>
							</ul>
						</div>
						<div>
							<h4 className="font-semibold mb-3 text-primary-100">Thông tin</h4>
							<ul className="space-y-2 text-sm text-primary-200">
								<li>📧 support@diabetescare.vn</li>
								<li>📱 (+84) 123-456-789</li>
								<li>🏢 TP. Hồ Chí Minh, Việt Nam</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-primary-700 pt-6 text-center text-sm text-primary-200">
						<p>© 2025 Diabetes Care. Được phát triển với ❤️ bởi Nhóm 30</p>
						<p className="mt-1">⚠️ Lưu ý: Đây là công cụ hỗ trợ, không thay thế chẩn đoán y tế chuyên nghiệp</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

function Home() {
	const { isAuthenticated } = useAuth();
	const nav = useNavigate();

	return (
		<div className="space-y-12 animate-fade-in">
			{/* Hero Section */}
			<div className="text-center space-y-6">
				<h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent animate-slide-up">
					Hệ thống Chẩn đoán Tiểu đường
				</h1>
				<p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
					Sử dụng công nghệ AI để dự đoán nguy cơ tiểu đường dựa trên các chỉ số sức khỏe của bạn
				</p>
				{!isAuthenticated && (
					<div className="flex gap-4 justify-center pt-4">
						<button onClick={() => nav('/register')} className="btn-primary text-lg px-8 py-4">
							Bắt đầu ngay 🚀
						</button>
						<button onClick={() => nav('/login')} className="btn-secondary text-lg px-8 py-4">
							Đăng nhập
						</button>
					</div>
				)}
				{isAuthenticated && (
					<button onClick={() => nav('/diagnosis')} className="btn-primary text-lg px-8 py-4">
						Chẩn đoán ngay 🏥
					</button>
				)}
			</div>

			{/* Features */}
			<div className="grid md:grid-cols-3 gap-8">
				<div className="feature-card">
					<div className="text-4xl mb-4">🤖</div>
					<h3 className="text-xl font-bold mb-2 text-gray-800">AI Thông minh</h3>
					<p className="text-gray-600">
						Sử dụng mô hình Machine Learning được huấn luyện trên hàng trăm nghìn ca bệnh thực tế
					</p>
				</div>
				<div className="feature-card">
					<div className="text-4xl mb-4">⚡</div>
					<h3 className="text-xl font-bold mb-2 text-gray-800">Nhanh chóng</h3>
					<p className="text-gray-600">
						Kết quả chẩn đoán trong vài giây, không cần chờ đợi lâu
					</p>
				</div>
				<div className="feature-card">
					<div className="text-4xl mb-4">🔒</div>
					<h3 className="text-xl font-bold mb-2 text-gray-800">Bảo mật</h3>
					<p className="text-gray-600">
						Thông tin sức khỏe của bạn được mã hóa và bảo mật tuyệt đối
					</p>
				</div>
			</div>

			{/* How it works */}
			<div className="card">
				<h2 className="text-2xl font-bold mb-6 text-center text-gray-800">📋 Cách sử dụng</h2>
				<div className="grid md:grid-cols-4 gap-6">
					<div className="text-center space-y-3">
						<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
							1
						</div>
						<h4 className="font-semibold text-gray-800">Đăng ký tài khoản</h4>
						<p className="text-sm text-gray-600">Tạo tài khoản miễn phí chỉ với email</p>
					</div>
					<div className="text-center space-y-3">
						<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
							2
						</div>
						<h4 className="font-semibold text-gray-800">Nhập thông tin</h4>
						<p className="text-sm text-gray-600">Điền các chỉ số sức khỏe của bạn (BMI, huyết áp...)</p>
					</div>
					<div className="text-center space-y-3">
						<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
							3
						</div>
						<h4 className="font-semibold text-gray-800">Nhận kết quả</h4>
						<p className="text-sm text-gray-600">AI phân tích và đưa ra dự đoán nguy cơ</p>
					</div>
					<div className="text-center space-y-3">
						<div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
							4
						</div>
						<h4 className="font-semibold text-gray-800">Nhận lời khuyên</h4>
						<p className="text-sm text-gray-600">Xem lời khuyên cá nhân hóa để cải thiện sức khỏe</p>
					</div>
				</div>
			</div>

			{/* Warning */}
			<div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
				<div className="flex items-start gap-4">
					<div className="text-3xl">⚠️</div>
					<div>
						<h3 className="font-bold text-yellow-800 mb-2">Lưu ý quan trọng</h3>
						<p className="text-yellow-700 leading-relaxed">
							Kết quả chẩn đoán từ hệ thống này chỉ mang tính tham khảo và không thay thế cho chẩn đoán y tế chuyên nghiệp. 
							Nếu có dấu hiệu bất thường, vui lòng tham khảo ý kiến bác sĩ.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login: authLogin } = useAuth();
	const nav = useNavigate();

	async function handleLogin(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const data = await login(email, password);
			authLogin(data.token);
			nav('/diagnosis');
		} catch (e: any) {
			setError(e.response?.data?.message || 'Email hoặc mật khẩu không đúng');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-md mx-auto animate-slide-up">
			<div className="card">
				<div className="text-center mb-6">
					<div className="text-5xl mb-4">🔐</div>
					<h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
					<p className="text-gray-600 mt-2">Chào mừng bạn trở lại!</p>
				</div>
				<form onSubmit={handleLogin} className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
						<input
							type="email"
							className="input-field"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="example@email.com"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
						<input
							type="password"
							className="input-field"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>
					</div>
					{error && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
							<p className="text-red-700 text-sm">❌ {error}</p>
						</div>
					)}
					<button
						type="submit"
						disabled={loading}
						className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
					</button>
				</form>
				<p className="text-center mt-6 text-gray-600">
					Chưa có tài khoản?{' '}
					<Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
						Đăng ký ngay
					</Link>
				</p>
			</div>
		</div>
	);
}

function Register() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [fullName, setFullName] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login: authLogin } = useAuth();
	const nav = useNavigate();

	async function handleRegister(e: React.FormEvent) {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			const data = await register(email, password, fullName);
			authLogin(data.token);
			nav('/diagnosis');
		} catch (e: any) {
			setError(e.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="max-w-md mx-auto animate-slide-up">
			<div className="card">
				<div className="text-center mb-6">
					<div className="text-5xl mb-4">✨</div>
					<h2 className="text-3xl font-bold text-gray-800">Đăng ký</h2>
					<p className="text-gray-600 mt-2">Tạo tài khoản miễn phí!</p>
				</div>
				<form onSubmit={handleRegister} className="space-y-4">
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
						<input
							type="text"
							className="input-field"
							value={fullName}
							onChange={(e) => setFullName(e.target.value)}
							placeholder="Nguyễn Văn A"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
						<input
							type="email"
							className="input-field"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="example@email.com"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
						<input
							type="password"
							className="input-field"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							required
						/>
					</div>
					{error && (
						<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
							<p className="text-red-700 text-sm">❌ {error}</p>
						</div>
					)}
					<button
						type="submit"
						disabled={loading}
						className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'Đang đăng ký...' : 'Đăng ký'}
					</button>
				</form>
				<p className="text-center mt-6 text-gray-600">
					Đã có tài khoản?{' '}
					<Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">
						Đăng nhập
					</Link>
				</p>
			</div>
		</div>
	);
}

function Diagnosis() {
	const [form, setForm] = useState<Record<string, number>>(getDefaultFormValues());
	const [result, setResult] = useState<null | number>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const scrollPositionRef = useRef<number>(0);

	function Field({ fieldDef }: { fieldDef: typeof diagnosisFields[0] }) {
		const value = form[fieldDef.name];
		
		const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
			// Save current scroll position
			scrollPositionRef.current = window.scrollY;
			
			const newValue = Number(e.target.value);
			setForm(prev => ({ ...prev, [fieldDef.name]: newValue }));
			
			// Restore scroll position after state update
			requestAnimationFrame(() => {
				window.scrollTo(0, scrollPositionRef.current);
			});
		};
		
		return (
			<div className="group bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-300">
				<label className="block">
					<span className="block text-sm font-semibold text-gray-800 mb-1 group-hover:text-primary-700 transition-colors">
						{fieldDef.label}
					</span>
					{fieldDef.hint && (
						<span className="block text-xs text-gray-500 mb-2 italic">
							💡 {fieldDef.hint}
						</span>
					)}
					
					{fieldDef.type === 'select' ? (
						<select
							className="input-field font-medium cursor-pointer"
							value={value}
							onChange={handleSelectChange}
							onFocus={(e) => e.target.style.scrollMarginTop = '100px'}
						>
							{fieldDef.options?.map(opt => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					) : (
						<div>
							<input
								type="number"
								min={fieldDef.min}
								max={fieldDef.max}
								step={fieldDef.step}
								className="input-field text-center font-medium"
								value={value}
								onChange={e => setForm(prev => ({ ...prev, [fieldDef.name]: Number(e.target.value) }))}
							/>
							{fieldDef.name === 'BMI' && (
								<div className="mt-2">
									<BMICalculator 
										onBMICalculated={(bmi) => setForm(prev => ({ ...prev, BMI: bmi }))}
									/>
								</div>
							)}
						</div>
					)}
				</label>
			</div>
		);
	}

	async function handleDiagnose() {
		setError('');
		setResult(null);
		setLoading(true);
		try {
			const data = await diagnose(form);
			setResult(data.prediction);
		} catch (e: any) {
			setError(e.response?.data?.message || 'Có lỗi xảy ra. Vui lòng kiểm tra kết nối và backend.');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="space-y-8">
			<div className="text-center animate-slide-up">
				<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
					🩺 Chẩn đoán nguy cơ tiểu đường
				</h1>
				<p className="text-gray-600">Vui lòng điền đầy đủ thông tin dưới đây</p>
			</div>

			<div className="card animate-fade-in">
				<div className="grid md:grid-cols-2 gap-6">
					{diagnosisFields.map((field) => (
						<Field key={field.name} fieldDef={field} />
					))}
				</div>
			</div>

			<div className="flex flex-col items-center gap-6">
				<button
					onClick={handleDiagnose}
					disabled={loading}
					className="btn-primary text-xl px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{loading ? (
						<span className="flex items-center gap-3">
							<span className="animate-spin">⏳</span>
							Đang phân tích...
						</span>
					) : '🔍 Dự đoán ngay'}
				</button>
				
				{result !== null && (
					<>
						<div className={`w-full max-w-2xl p-8 rounded-2xl text-center shadow-xl animate-slide-up ${result ? 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300' : 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300'}`}>
							<div className="text-6xl mb-4 animate-bounce">{result ? '⚠️' : '✅'}</div>
							<h3 className={`text-2xl md:text-3xl font-bold mb-3 ${result ? 'text-red-800' : 'text-green-800'}`}>
								{result ? 'Có nguy cơ tiểu đường' : 'Không có nguy cơ tiểu đường'}
							</h3>
							<div className={`inline-block px-4 py-2 rounded-full mb-4 ${result ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'} font-semibold`}>
								Kết quả: {result}
							</div>
							<p className="text-gray-700 leading-relaxed max-w-xl mx-auto">
								{result 
									? '⚕️ Bạn nên tham khảo ý kiến bác sĩ để được tư vấn và kiểm tra chi tiết hơn. Đây chỉ là dự đoán sơ bộ dựa trên AI.'
									: '🎉 Kết quả tốt! Hãy duy trì lối sống lành mạnh, ăn uống cân bằng và kiểm tra sức khoẻ định kỳ.'
								}
							</p>
						</div>

						{/* Lời khuyên sức khỏe */}
						<div className="w-full max-w-4xl animate-slide-up">
							<div className="card">
								<div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
									<div className="p-2 bg-indigo-100 rounded-lg">
										<span className="text-2xl">💡</span>
									</div>
									<div>
										<h3 className="text-xl font-bold text-gray-800">Lời khuyên cho bạn</h3>
										<p className="text-sm text-gray-500">Dựa trên kết quả và các chỉ số của bạn</p>
									</div>
								</div>

								<div className="space-y-4">
									{generateHealthAdvice(result, form).map((advice, index) => (
										<div
											key={index}
											className={`p-4 rounded-xl border-l-4 ${
												advice.priority === 'high'
													? 'bg-red-50 border-red-500'
													: advice.priority === 'medium'
													? 'bg-yellow-50 border-yellow-500'
													: 'bg-blue-50 border-blue-500'
											} hover:shadow-md transition-all`}
										>
											<div className="flex items-start gap-3">
												<div className="text-3xl flex-shrink-0">{advice.icon}</div>
												<div className="flex-1">
													<h4 className="font-bold text-lg text-gray-800 mb-1">
														{advice.title}
													</h4>
													<p className="text-sm text-gray-700 leading-relaxed">
														{advice.description}
													</p>
												</div>
												{advice.priority === 'high' && (
													<div className="flex-shrink-0 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
														Quan trọng
													</div>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</>
				)}

				{error && (
					<div className="w-full max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded">
						<p className="text-red-700 font-medium">❌ {error}</p>
					</div>
				)}
			</div>
		</div>
	);
}

function History() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchHistory() {
			try {
				const result = await history();
				setData(result);
			} catch (e) {
				console.error('Failed to fetch history', e);
			} finally {
				setLoading(false);
			}
		}
		fetchHistory();
	}, []);

	if (loading) {
		return (
			<div className="text-center py-12">
				<div className="text-6xl mb-4 animate-bounce">⏳</div>
				<p className="text-xl text-gray-600">Đang tải lịch sử...</p>
			</div>
		);
	}

	if (data.length === 0) {
		return (
			<div className="text-center py-12 animate-fade-in">
				<div className="text-6xl mb-4">📭</div>
				<h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có lịch sử chẩn đoán</h2>
				<p className="text-gray-600 mb-6">Hãy thực hiện chẩn đoán đầu tiên của bạn!</p>
				<Link to="/diagnosis" className="btn-primary inline-block">
					Chẩn đoán ngay 🏥
				</Link>
			</div>
		);
	}

	return (
		<div className="space-y-6 animate-fade-in">
			<div className="text-center">
				<h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
					📊 Lịch sử chẩn đoán
				</h1>
				<p className="text-gray-600">Tổng số lần chẩn đoán: <span className="font-bold text-primary-600">{data.length}</span></p>
			</div>

			<div className="grid gap-6">
				{data.map((item) => (
					<div
						key={item.id}
						className={`card hover:scale-[1.02] transition-transform ${
							item.prediction === 1 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
						}`}
					>
						<div className="flex items-start justify-between mb-4">
							<div className="flex items-center gap-3">
								<div className="text-4xl">{item.prediction === 1 ? '⚠️' : '✅'}</div>
								<div>
									<h3 className={`text-xl font-bold ${item.prediction === 1 ? 'text-red-700' : 'text-green-700'}`}>
										{item.prediction === 1 ? 'Có nguy cơ tiểu đường' : 'Không có nguy cơ'}
									</h3>
									<p className="text-sm text-gray-500">
										{new Date(item.createdAt).toLocaleString('vi-VN')}
									</p>
								</div>
							</div>
							<div className={`px-3 py-1 rounded-full text-sm font-semibold ${
								item.prediction === 1 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
							}`}>
								Kết quả: {item.prediction}
							</div>
						</div>

						<details className="mt-4">
							<summary className="cursor-pointer text-primary-600 font-semibold hover:text-primary-700 select-none">
								📋 Xem chi tiết các chỉ số
							</summary>
							<div className="mt-4 grid md:grid-cols-3 gap-3">
								{Object.entries(item.inputData).map(([key, value]) => {
									const field = diagnosisFields.find(f => f.name === key);
									return (
										<div key={key} className="bg-gray-50 p-3 rounded-lg">
											<div className="text-xs text-gray-500">{field?.label || key}</div>
											<div className="font-semibold text-gray-800">
												{field?.type === 'select' 
													? field.options?.find(o => o.value === value)?.label || value
													: value
												}
											</div>
										</div>
									);
								})}
							</div>
						</details>
					</div>
				))}
			</div>
		</div>
	);
}

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/diagnosis" element={<ProtectedRoute><Diagnosis /></ProtectedRoute>} />
						<Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	);
}

