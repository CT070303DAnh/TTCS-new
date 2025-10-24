import { useState } from 'react';

interface BMICalculatorProps {
    onBMICalculated: (bmi: number) => void;
}

export function BMICalculator({ onBMICalculated }: BMICalculatorProps) {
    const [showCalculator, setShowCalculator] = useState(false);
    const [height, setHeight] = useState<number | ''>('');
    const [weight, setWeight] = useState<number | ''>('');
    const [bmi, setBmi] = useState<number | null>(null);
    const [category, setCategory] = useState<string | null>(null);

    const calculateBMI = () => {
        if (height && weight) {
            const h = Number(height) / 100; // convert cm to meters
            const w = Number(weight);
            const calculatedBmi = parseFloat((w / (h * h)).toFixed(1));
            setBmi(calculatedBmi);
            onBMICalculated(calculatedBmi); // Pass calculated BMI to parent form

            if (calculatedBmi < 18.5) {
                setCategory('Gầy');
            } else if (calculatedBmi >= 18.5 && calculatedBmi <= 24.9) {
                setCategory('Bình thường');
            } else if (calculatedBmi >= 25 && calculatedBmi <= 29.9) {
                setCategory('Thừa cân');
            } else {
                setCategory('Béo phì');
            }
        } else {
            setBmi(null);
            setCategory(null);
        }
    };

    const getCategoryColor = (cat: string | null) => {
        switch (cat) {
            case 'Gầy': return 'text-blue-600';
            case 'Bình thường': return 'text-green-600';
            case 'Thừa cân': return 'text-yellow-600';
            case 'Béo phì': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 shadow-inner">
            <button
                onClick={() => setShowCalculator(!showCalculator)}
                className="w-full text-primary-700 hover:text-primary-900 font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2"
            >
                {showCalculator ? '✕ Đóng máy tính BMI' : '🧮 Tính BMI của bạn'}
            </button>

            {showCalculator && (
                <div className="mt-4 space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chiều cao (cm)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="VD: 170"
                            value={height}
                            onChange={e => setHeight(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cân nặng (kg)</label>
                        <input
                            type="number"
                            className="input-field"
                            placeholder="VD: 65"
                            value={weight}
                            onChange={e => setWeight(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <button
                        onClick={calculateBMI}
                        className="btn-primary w-full"
                    >
                        Tính BMI
                    </button>

                    {bmi !== null && (
                        <div className="text-center mt-4 p-4 bg-white rounded-lg shadow-md">
                            <p className="text-lg font-semibold text-gray-800">Chỉ số BMI của bạn:</p>
                            <p className={`text-4xl font-bold ${getCategoryColor(category)} my-2`}>{bmi}</p>
                            <p className={`text-xl font-semibold ${getCategoryColor(category)}`}>
                                ({category})
                            </p>
                            <div className="mt-4 text-sm text-gray-600">
                                <p>Bảng phân loại BMI:</p>
                                <ul className="list-disc list-inside text-left mx-auto max-w-xs">
                                    <li className="text-blue-600">Gầy: &lt; 18.5</li>
                                    <li className="text-green-600">Bình thường: 18.5 - 24.9</li>
                                    <li className="text-yellow-600">Thừa cân: 25 - 29.9</li>
                                    <li className="text-red-600">Béo phì: &ge; 30</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

