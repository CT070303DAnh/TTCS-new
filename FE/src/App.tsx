import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { login, register, diagnose, history } from './lib/api';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { diagnosisFields, getDefaultFormValues } from './utils/diagnosisFields';
import { BMICalculator } from './components/BMICalculator';
import { generateHealthAdvice } from './utils/healthAdvice';
import { ChatWidget } from './components/ChatWidget';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRobot, faBoltLightning, faLock, faClipboardList, faTriangleExclamation, faHandHoldingHeart,
    faHospital, faBookMedical, faClockRotateLeft, faStethoscope, faRocket, faCity,
    faPhoneVolume, faRegistered, faUnlockKeyhole, faDoorOpen, faLightbulb,
    faMagnifyingGlassDollar, faFire, faBriefcaseMedical, faBoxOpen, faCircleXmark,
    faMailBulk, faCheckCircle, faHourglassHalf, faAreaChart,
    // New icons for Wizard layout
    faArrowRight, faArrowLeft, faUser, faHeartPulse, faWalking, faRedo
} from '@fortawesome/free-solid-svg-icons';

// --- LAYOUT (PRESERVED) ---
function Layout({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, logout, userEmail } = useAuth();
    const nav = useNavigate();

    const handleLogout = () => {
        logout();
        nav('/');
    };

    const displayName = userEmail ? userEmail.split('@')[0] : '';

    return (
        <div className="min-h-screen gradient-bg flex flex-col">
            <header className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hover:from-primary-700 hover:to-primary-900 transition-all transform hover:scale-105">
                        <FontAwesomeIcon icon={faStethoscope} style={{ color: '#0479B6' }} /> Diabetes Care
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
                                        <FontAwesomeIcon icon={faDoorOpen} style={{ color: '#0885C3' }} size="xl" />
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
                                <FontAwesomeIcon icon={faStethoscope} style={{ color: '#0479B6' }} /> Diabetes Care
                            </h3>
                            <p className="text-primary-100 text-sm leading-relaxed">
                                Hệ thống chẩn đoán nguy cơ tiểu đường sử dụng AI, giúp bạn theo dõi sức khoẻ hiệu quả.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-primary-100">Liên kết</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="text-primary-200 hover:text-white transition-colors"><FontAwesomeIcon icon={faHospital} style={{ color: '#10f491' }} /> Trang chủ</Link></li>
                                <li><Link to="/diagnosis" className="text-primary-200 hover:text-white transition-colors"><FontAwesomeIcon icon={faBookMedical} style={{ color: '#0ed8d4' }} /> Chẩn đoán</Link></li>
                                <li><Link to="/history" className="text-primary-200 hover:text-white transition-colors"><FontAwesomeIcon icon={faClockRotateLeft} style={{ color: '#ffffff' }} /> Lịch sử</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-3 text-primary-100">Thông tin</h4>
                            <ul className="space-y-2 text-sm text-primary-200">
                                <li><FontAwesomeIcon icon={faMailBulk} style={{ color: '#6eee5d' }} /> support@diabetescare.vn</li>
                                <li><FontAwesomeIcon icon={faPhoneVolume} style={{ color: '#aec3F4' }} /> (+84) 123-456-789</li>
                                <li><FontAwesomeIcon icon={faCity} style={{ color: '#beb3c4' }} /> TP. Hồ Chí Minh, Việt Nam</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-primary-700 pt-6 text-center text-sm text-primary-200">
                        <p>© 2025 Diabetes Care. Được phát triển với <FontAwesomeIcon icon={faHandHoldingHeart} size='lg' style={{ color: '#e1093f' }} /> bởi Nhóm 30</p>
                        <p className="mt-1"><FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#45e600' }} /> Lưu ý: Đây là công cụ hỗ trợ, không thay thế chẩn đoán y tế chuyên nghiệp</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// --- HOME (PRESERVED) ---
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
                            Bắt đầu ngay <FontAwesomeIcon icon={faRocket} style={{ color: '#eadcdc' }} />
                        </button>
                        <button onClick={() => nav('/login')} className="btn-secondary text-lg px-8 py-4">
                            Đăng nhập
                        </button>
                    </div>
                )}
                {isAuthenticated && (
                    <button onClick={() => nav('/diagnosis')} className="btn-primary text-lg px-8 py-4">
                        Chẩn đoán ngay <FontAwesomeIcon icon={faBookMedical} style={{ color: '#0ed8d4' }} />
                    </button>
                )}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="feature-card">
                    <div className="text-4xl mb-4"><FontAwesomeIcon icon={faRobot} style={{ color: "#b63a1b", }} /></div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">AI Thông minh</h3>
                    <p className="text-gray-600">Sử dụng mô hình Machine Learning được huấn luyện trên hàng trăm nghìn ca bệnh thực tế</p>
                </div>
                <div className="feature-card">
                    <div className="text-4xl mb-4"><FontAwesomeIcon icon={faBoltLightning} style={{ color: "#FFD43B", }} /></div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Nhanh chóng</h3>
                    <p className="text-gray-600">Kết quả chẩn đoán trong vài giây, không cần chờ đợi lâu</p>
                </div>
                <div className="feature-card">
                    <div className="text-4xl mb-4"><FontAwesomeIcon icon={faLock} style={{ color: "#74C0FC", }} /></div>
                    <h3 className="text-xl font-bold mb-2 text-gray-800">Bảo mật</h3>
                    <p className="text-gray-600">Thông tin sức khỏe của bạn được mã hóa và bảo mật tuyệt đối</p>
                </div>
            </div>

            {/* How it works */}
            <div className="card">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800"><FontAwesomeIcon icon={faClipboardList} size='xl' style={{ color: "#113778", }} /> Cách sử dụng</h2>
                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        { step: 1, title: 'Đăng ký tài khoản', desc: 'Tạo tài khoản miễn phí chỉ với email' },
                        { step: 2, title: 'Nhập thông tin', desc: 'Điền các chỉ số sức khỏe của bạn (BMI, huyết áp...)' },
                        { step: 3, title: 'Nhận kết quả', desc: 'AI phân tích và đưa ra dự đoán nguy cơ' },
                        { step: 4, title: 'Nhận lời khuyên', desc: 'Xem lời khuyên cá nhân hóa để cải thiện sức khỏe' }
                    ].map((item) => (
                        <div key={item.step} className="text-center space-y-3">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg">
                                {item.step}
                            </div>
                            <h4 className="font-semibold text-gray-800">{item.title}</h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                    <div className="text-3xl"><FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#45e600' }} /></div>
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

// --- LOGIN (PRESERVED) ---
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login: authLogin } = useAuth();
    const nav = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(''); setLoading(true);
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
                    <div className="text-5xl mb-4"><FontAwesomeIcon icon={faUnlockKeyhole} style={{ color: '#0272AE' }} /></div>
                    <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
                    <p className="text-gray-600 mt-2">Chào mừng bạn trở lại!</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                        <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700 text-sm"><FontAwesomeIcon icon={faCircleXmark} style={{ color: '#0479B6' }} /> {error}</p>
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Chưa có tài khoản? <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">Đăng ký ngay</Link>
                </p>
            </div>
        </div>
    );
}

// --- REGISTER (PRESERVED) ---
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
        setError(''); setLoading(true);
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
                    <div className="text-5xl mb-4"><FontAwesomeIcon icon={faRegistered} style={{ color: '#0272AE' }} /></div>
                    <h2 className="text-3xl font-bold text-gray-800">Đăng ký</h2>
                    <p className="text-gray-600 mt-2">Tạo tài khoản miễn phí!</p>
                </div>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                        <input type="text" className="input-field" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                        <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" required />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Mật khẩu</label>
                        <input type="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    </div>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700 text-sm"><FontAwesomeIcon icon={faCircleXmark} style={{ color: '#0479B6' }} /> {error}</p>
                        </div>
                    )}
                    <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Đã có tài khoản? <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
}

// --- FIELD COMPONENT (PRESERVED WITH STYLES) ---
function Field({ fieldDef, value, onChange }: { fieldDef: typeof diagnosisFields[0], value: number, onChange: (val: number) => void }) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className={`group bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl border-2 transition-all duration-300 ${isFocused
            ? 'border-primary-500 shadow-lg bg-gradient-to-br from-primary-50 to-white ring-2 ring-primary-200'
            : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
            }`}>
            <label className="block">
                <span className="block text-sm font-bold text-gray-800 mb-1 group-hover:text-primary-700 transition-colors">
                    {fieldDef.label}
                </span>
                {fieldDef.hint && (
                    <span className="block text-xs text-gray-500 mb-3 italic">
                        <FontAwesomeIcon icon={faLightbulb} style={{ color: '#FFD35D' }} /> {fieldDef.hint}
                    </span>
                )}

                {fieldDef.type === 'select' ? (
                    <select
                        className="input-field font-medium cursor-pointer hover:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all"
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    >
                        {fieldDef.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-gray-500">Giá trị hiện tại:</span>
                            <span className={`text-lg font-bold transition-colors duration-200 ${isFocused ? 'text-primary-600' : 'text-gray-800'}`}>
                                {value}
                            </span>
                        </div>

                        <input
                            type="range"
                            min={fieldDef.min}
                            max={fieldDef.max}
                            step={fieldDef.step}
                            value={value}
                            onChange={e => onChange(Number(e.target.value))}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600 hover:accent-primary-700 transition-all"
                            style={{
                                background: `linear-gradient(to right, rgb(79, 70, 229) 0%, rgb(79, 70, 229) ${((value - (fieldDef.min || 0)) / ((fieldDef.max || 100) - (fieldDef.min || 0))) * 100}%, rgb(229, 231, 235) ${((value - (fieldDef.min || 0)) / ((fieldDef.max || 100) - (fieldDef.min || 0))) * 100}%, rgb(229, 231, 235) 100%)`
                            }}
                        />

                        <input
                            type="number"
                            min={fieldDef.min}
                            max={fieldDef.max}
                            step={fieldDef.step}
                            className="input-field text-center font-bold text-lg hover:border-primary-400 focus:ring-2 focus:ring-primary-300 transition-all"
                            value={value}
                            onChange={e => onChange(Number(e.target.value))}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />

                        <div className="flex justify-between text-xs text-gray-400 font-medium">
                            <span>Min: {fieldDef.min}</span>
                            <span>Max: {fieldDef.max}</span>
                        </div>

                        {fieldDef.name === 'BMI' && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                                <BMICalculator onBMICalculated={(bmi) => onChange(bmi)} />
                            </div>
                        )}
                    </div>
                )}
            </label>
        </div>
    );
}

// --- DIAGNOSIS (UPDATED WITH WIZARD LAYOUT & FIXES) ---
function Diagnosis() {
    const [form, setForm] = useState<Record<string, number>>(getDefaultFormValues());
    const [result, setResult] = useState<null | number>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Thông tin cá nhân",
            description: "Chỉ số cơ bản và nhân khẩu học",
            icon: faUser,
            fields: ['Sex', 'Age', 'BMI', 'Education', 'Income']
        },
        {
            title: "Tình trạng sức khỏe",
            description: "Tiền sử bệnh lý và chỉ số y tế",
            icon: faHeartPulse,
            fields: ['HighBP', 'HighChol', 'CholCheck', 'Stroke', 'HeartDiseaseorAttack', 'GenHlth', 'DiffWalk']
        },
        {
            title: "Lối sống & Thói quen",
            description: "Chế độ ăn uống, vận động và tâm lý",
            icon: faWalking,
            fields: ['Smoker', 'PhysActivity', 'Fruits', 'Veggies', 'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'MentHlth', 'PhysHlth']
        }
    ];

    const currentFields = diagnosisFields.filter(f => steps[currentStep].fields.includes(f.name));

    const handleFieldChange = (name: string, val: number) => {
        setForm(prev => ({ ...prev, [name]: val }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(c => c + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(c => c - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    async function handleDiagnose() {
        setError(''); setResult(null); setLoading(true);
        try {
            const data = await diagnose(form);
            setResult(data.prediction);
            setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
        } catch (e: any) {
            console.error("Lỗi:", e);
            setError(e.response?.data?.message || 'Có lỗi xảy ra từ máy chủ.');
        } finally {
            setLoading(false);
        }
    }

    const isRisk = result !== null && result !== 0;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            {result === null ? (
                // --- FORM NHẬP LIỆU (WIZARD) ---
                <>
                    <div className="text-center mb-10 animate-slide-up">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                            <FontAwesomeIcon icon={faStethoscope} className="text-primary-600 mr-3" />
                            Chẩn đoán nguy cơ
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Hoàn thành 3 bước khảo sát để AI phân tích tình trạng sức khỏe của bạn.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8 px-2 md:px-0">
                        <div className="flex justify-between mb-4 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 transform -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 h-1 bg-primary-600 -z-10 transform -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>

                            {steps.map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${idx <= currentStep ? 'bg-primary-600 text-white shadow-lg scale-110' : 'bg-white border-2 border-gray-300 text-gray-400'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className={`mt-2 text-xs md:text-sm font-semibold ${idx === currentStep ? 'text-primary-700' : 'text-gray-500'}`}>{step.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="animate-fade-in">
                        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100 mb-8">
                            <div className="mb-8 pb-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 text-xl">
                                    <FontAwesomeIcon icon={steps[currentStep].icon} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{steps[currentStep].title}</h2>
                                    <p className="text-gray-500 text-sm">{steps[currentStep].description}</p>
                                </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {currentFields.map(field => (
                                    <Field key={field.name} fieldDef={field} value={form[field.name]} onChange={(val) => handleFieldChange(field.name, val)} />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-2">
                            <button onClick={handleBack} disabled={currentStep === 0} className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Quay lại
                            </button>
                            
                            {currentStep < steps.length - 1 ? (
                                <button onClick={handleNext} className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-primary-700 hover:shadow-primary-500/30 flex items-center gap-2 transform active:scale-95 transition-all">
                                    Tiếp tục <FontAwesomeIcon icon={faArrowRight} />
                                </button>
                            ) : (
                                <button onClick={handleDiagnose} disabled={loading} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-green-500/30 flex items-center gap-2 transform active:scale-95 transition-all disabled:opacity-70">
                                    {loading ? <><FontAwesomeIcon icon={faHourglassHalf} className="animate-spin" /> Đang phân tích...</> : <><FontAwesomeIcon icon={faMagnifyingGlassDollar} /> Xem kết quả</>}
                                </button>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                // --- MÀN HÌNH KẾT QUẢ (ĐÃ KHÔI PHỤC NỘI DUNG GỐC) ---
                <div id="result-section" className="space-y-8 animate-slide-up">
                    <div className={`relative overflow-hidden w-full p-10 rounded-3xl text-center shadow-2xl ${
                        isRisk 
                        ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white' 
                        : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                    }`}>
                        {/* Background Pattern */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <FontAwesomeIcon icon={faStethoscope} className="absolute -top-10 -left-10 text-[15rem]" />
                        </div>

                        <div className="relative z-10">
                            <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm shadow-inner">
                                <FontAwesomeIcon icon={isRisk ? faTriangleExclamation : faCheckCircle} className="text-5xl text-white drop-shadow-md animate-bounce" />
                            </div>
                            
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                                {isRisk ? 'CÓ NGUY CƠ TIỂU ĐƯỜNG' : 'KHÔNG CÓ NGUY CƠ'}
                            </h2>
                            
                            {/* --- ĐÂY LÀ PHẦN ĐÃ KHÔI PHỤC 2 ICON CŨ --- */}
                            <div className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto font-medium mb-8 leading-relaxed bg-white/10 p-6 rounded-2xl border border-white/20 backdrop-blur-md">
                                {isRisk ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-4xl mb-1"><FontAwesomeIcon icon={faBriefcaseMedical} /></div>
                                        <span>Bạn nên tham khảo ý kiến bác sĩ để được tư vấn và kiểm tra chi tiết hơn. Đây chỉ là dự đoán sơ bộ dựa trên AI.</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="text-4xl mb-1"><FontAwesomeIcon icon={faFire} /></div>
                                        <span>Kết quả tốt! Hãy duy trì lối sống lành mạnh, ăn uống cân bằng và kiểm tra sức khoẻ định kỳ.</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col md:flex-row justify-center gap-4">
                                <button 
                                    onClick={() => {
                                        setResult(null);
                                        setCurrentStep(0);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-white text-gray-900 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faRedo} /> Chỉnh sửa lại
                                </button>

                                <button 
                                    onClick={() => {
                                        setResult(null);
                                        setCurrentStep(0);
                                        setForm(getDefaultFormValues());
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-white/20 text-white border-2 border-white/40 px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faClipboardList} /> Nhập mới
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
                                <FontAwesomeIcon icon={faLightbulb} className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800">Lời khuyên dành riêng cho bạn</h3>
                                <p className="text-gray-500">Được cá nhân hóa dựa trên 21 chỉ số vừa nhập</p>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            {generateHealthAdvice(result, form).map((advice, index) => (
                                <div key={index} className={`p-5 rounded-2xl border-l-4 transition-all hover:shadow-lg bg-gray-50 ${
                                    advice.priority === 'high' ? 'border-red-500 bg-red-50' : 
                                    advice.priority === 'medium' ? 'border-orange-500 bg-orange-50' : 'border-blue-500 bg-blue-50'
                                }`}>
                                    <div className="flex gap-4">
                                        <div className="text-2xl mt-1">{advice.icon}</div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1 text-gray-800">{advice.title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{advice.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {error && (
                <div className="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-up z-50">
                    <FontAwesomeIcon icon={faCircleXmark} className="text-xl" />
                    <div>
                        <h4 className="font-bold">Đã có lỗi xảy ra</h4>
                        <p className="text-sm text-red-100">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- HISTORY (PRESERVED) ---
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
                <div className="text-6xl mb-4 animate-bounce"><FontAwesomeIcon icon={faHourglassHalf} style={{ color: '#BF2D2D' }} /></div>
                <p className="text-xl text-gray-600">Đang tải lịch sử...</p>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center py-12 animate-fade-in">
                <div className="text-6xl mb-4"><FontAwesomeIcon icon={faBoxOpen} style={{ color: '#5095D9' }} /></div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Chưa có lịch sử chẩn đoán</h2>
                <p className="text-gray-600 mb-6">Hãy thực hiện chẩn đoán đầu tiên của bạn!</p>
                <Link to="/diagnosis" className="btn-primary inline-block">
                    Chẩn đoán ngay <FontAwesomeIcon icon={faBookMedical} style={{ color: '#0ed8d4' }} />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    <FontAwesomeIcon icon={faAreaChart} style={{ color: '#379BEA' }} /> Lịch sử chẩn đoán
                </h1>
                <p className="text-gray-600">Tổng số lần chẩn đoán: <span className="font-bold text-primary-600">{data.length}</span></p>
            </div>

            <div className="grid gap-6">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className={`card hover:scale-[1.02] transition-transform ${item.prediction !== 0 ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="text-4xl">{item.prediction !== 0 ? <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: '#EF4444' }} /> : <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#58D58D' }} />}</div>
                                <div>
                                    <h3 className={`text-xl font-bold ${item.prediction !== 0 ? 'text-red-700' : 'text-green-700'}`}>
                                        {item.prediction !== 0 ? 'Có nguy cơ tiểu đường' : 'Không có nguy cơ'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(item.createdAt).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${item.prediction !== 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                Kết quả: {item.prediction}
                            </div>
                        </div>

                        <details className="mt-4">
                            <summary className="cursor-pointer text-primary-600 font-semibold hover:text-primary-700 select-none">
                                <FontAwesomeIcon icon={faClipboardList} style={{ color: '#D2C9DB' }} /> Xem chi tiết các chỉ số
                            </summary>
                            <div className="mt-4 grid md:grid-cols-3 gap-3">
                                {Object.entries(item.inputData).map(([key, value]) => {
                                    const field = diagnosisFields.find(f => f.name === key);
                                    const numValue = Number(value);
                                    return (
                                        <div key={key} className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-xs text-gray-500">{field?.label || key}</div>
                                            <div className="font-semibold text-gray-800">
                                                {field?.type === 'select'
                                                    ? field.options?.find(o => o.value === numValue)?.label || String(value)
                                                    : String(value)
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
					<ChatWidget />
                </Layout>
            </BrowserRouter>
        </AuthProvider>
    );
}