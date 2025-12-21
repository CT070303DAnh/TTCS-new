import { useState } from 'react';
import { chatWithBot } from '../lib/api';

type Msg = { sender: 'user' | 'bot'; text: string };

export function ChatWidget() {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [logs, setLogs] = useState<Msg[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const send = async () => {
		const text = input.trim();
		if (!text || loading) return;
		setLogs((l) => [...l, { sender: 'user', text }]);
		setInput('');
		setError('');
		setLoading(true);
		try {
			const res = await chatWithBot(text);
			const botText =
				res?.answer ||
				res?.output?.answer ||
				(typeof res === 'string' ? res : JSON.stringify(res));
			setLogs((l) => [...l, { sender: 'bot', text: botText }]);
		} catch (e: any) {
			setError(e?.message || 'Gửi thất bại, thử lại.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{open && (
				<div className="w-80 h-96 bg-white shadow-2xl rounded-xl border border-gray-200 flex flex-col">
					<div className="px-4 py-2 border-b flex items-center justify-between">
						<div className="font-semibold text-gray-800">Trợ lý y tế</div>
						<button onClick={() => setOpen(false)} className="text-sm text-gray-500">
							×
						</button>
					</div>
					<div className="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
						{logs.map((m, i) => (
							<div
								key={i}
								className={`max-w-[90%] ${
									m.sender === 'user'
										? 'ml-auto bg-blue-50 text-gray-800'
										: 'mr-auto bg-gray-100 text-gray-800'
								} px-3 py-2 rounded-lg`}
							>
								{m.text}
							</div>
						))}
						{loading && <div className="text-gray-400 text-xs">Đang gõ...</div>}
						{error && <div className="text-red-500 text-xs">{error}</div>}
					</div>
					<div className="p-3 border-t flex gap-2">
						<input
							className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
							placeholder="Nhập câu hỏi..."
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && send()}
						/>
						<button
							onClick={send}
							disabled={loading}
							className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm disabled:opacity-60"
						>
							Gửi
						</button>
					</div>
				</div>
			)}
			{!open && (
				<button
					onClick={() => setOpen(true)}
					className="bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-blue-700"
				>
					Chat với AI
				</button>
			)}
		</div>
	);
}

