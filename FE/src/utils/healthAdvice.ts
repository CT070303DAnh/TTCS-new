import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { 
    faUserMd, 
    faWeightScale, 
    faPersonRunning, 
    faCarrot, 
    faPills, 
    faHeartPulse, 
    faBanSmoking, 
    faWineGlass, 
    faBrain, 
    faStethoscope, 
    faWheelchair, 
    faClipboardList, 
    faIdCard, 
    faHandHoldingDollar, 
    faDumbbell, 
    faStar,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export interface HealthAdvice {
  title: string;
  icon: IconDefinition;
  description: string;
  priority: 'high' | 'medium' | 'low';
  color: string;
}

export function generateHealthAdvice(
  prediction: number,
  formData: Record<string, number>
): HealthAdvice[] {
  const advice: HealthAdvice[] = [];

  if (prediction === 1) {
    advice.push({
      title: 'Khám bác sĩ ngay',
      icon: faUserMd,
      color: 'text-red-600',
      description: 'Kết quả cho thấy nguy cơ tiểu đường. Hãy đặt lịch khám với bác sĩ chuyên khoa nội tiết để được tư vấn và xét nghiệm chuyên sâu.',
      priority: 'high'
    });
  }

  const bmi = formData.BMI || 0;
  if (bmi >= 30) {
    advice.push({
      title: 'Giảm cân',
      icon: faWeightScale,
      color: 'text-orange-600',
      description: `BMI của bạn là ${bmi.toFixed(1)} (béo phì). Hãy xây dựng chế độ ăn uống lành mạnh và tập luyện đều đặn. Mục tiêu giảm 5-10% cân nặng.`,
      priority: 'high'
    });
  } else if (bmi >= 25) {
    advice.push({
      title: 'Kiểm soát cân nặng',
      icon: faWeightScale,
      color: 'text-yellow-600',
      description: `BMI của bạn là ${bmi.toFixed(1)} (thừa cân). Duy trì cân nặng ổn định và tăng cường vận động để tránh béo phì.`,
      priority: 'medium'
    });
  }

  if (formData.PhysActivity === 0) {
    advice.push({
      title: 'Tăng cường vận động',
      icon: faPersonRunning,
      color: 'text-blue-500', 
      description: 'Hãy tập thể dục ít nhất 150 phút/tuần. Đi bộ, bơi lội, đạp xe đều rất tốt cho sức khỏe và giảm nguy cơ tiểu đường.',
      priority: 'high'
    });
  }

  if (formData.Fruits === 0 || formData.Veggies === 0) {
    const missing = [];
    if (formData.Fruits === 0) missing.push('hoa quả');
    if (formData.Veggies === 0) missing.push('rau xanh');
    
    advice.push({
      title: 'Cải thiện chế độ ăn',
      icon: faCarrot,
      color: 'text-green-600',
      description: `Bạn chưa ăn đủ ${missing.join(' và ')}. Hãy bổ sung ít nhất 5 phần rau củ quả mỗi ngày để cung cấp vitamin và chất xơ.`,
      priority: 'high'
    });
  }

  if (formData.HighBP === 1) {
    advice.push({
      title: 'Kiểm soát huyết áp',
      icon: faPills,
      color: 'text-red-500',
      description: 'Huyết áp cao làm tăng nguy cơ biến chứng. Uống thuốc đều đặn, giảm muối và theo dõi huyết áp thường xuyên.',
      priority: 'high'
    });
  }

  if (formData.HighChol === 1) {
    advice.push({
      title: 'Kiểm soát cholesterol',
      icon: faHeartPulse,
      color: 'text-rose-500',
      description: 'Giảm thực phẩm giàu chất béo bão hòa. Ăn nhiều cá hồi, hạt óc chó, dầu ô liu để bảo vệ tim mạch.',
      priority: 'high'
    });
  }

  if (formData.Smoker === 1) {
    advice.push({
      title: 'Bỏ thuốc lá',
      icon: faBanSmoking,
      color: 'text-gray-600',
      description: 'Hút thuốc làm tăng nguy cơ tiểu đường type 2. Hãy tham khảo các liệu pháp cai thuốc lá.',
      priority: 'high'
    });
  }

  if (formData.HvyAlcoholConsump === 1) {
    advice.push({
      title: 'Giảm rượu bia',
      icon: faWineGlass,
      color: 'text-amber-600',
      description: 'Hạn chế rượu bia giúp bảo vệ gan và kiểm soát đường huyết. Mức an toàn: Nam <14 ly/tuần, Nữ <7 ly/tuần.',
      priority: 'medium'
    });
  }

  if (formData.HeartDiseaseorAttack === 1 || formData.Stroke === 1) {
    advice.push({
      title: 'Theo dõi tim mạch',
      icon: faHeartPulse,
      color: 'text-red-600',
      description: 'Tiền sử bệnh tim cần được quản lý chặt chẽ. Khám định kỳ và tuân thủ phác đồ điều trị của bác sĩ.',
      priority: 'high'
    });
  }

  const mentalHealth = formData.MentHlth || 0;
  if (mentalHealth >= 15) {
    advice.push({
      title: 'Chăm sóc tinh thần',
      icon: faBrain,
      color: 'text-purple-600',
      description: `Stress ảnh hưởng đến đường huyết. Hãy dành thời gian thư giãn, thiền hoặc tìm sự hỗ trợ tâm lý.`,
      priority: 'medium'
    });
  }

  const physHealth = formData.PhysHlth || 0;
  if (physHealth >= 15) {
    advice.push({
      title: 'Khám sức khỏe tổng quát',
      icon: faStethoscope,
      color: 'text-teal-600',
      description: `Bạn có nhiều ngày sức khỏe kém. Hãy đi khám để tìm nguyên nhân và điều trị kịp thời.`,
      priority: 'medium'
    });
  }

  if (formData.DiffWalk === 1) {
    advice.push({
      title: 'Vật lý trị liệu',
      icon: faWheelchair,
      color: 'text-indigo-600',
      description: 'Tham khảo bác sĩ về liệu pháp vật lý hoặc các bài tập nhẹ nhàng như bơi lội để cải thiện vận động.',
      priority: 'medium'
    });
  }

  if (formData.CholCheck === 0) {
    advice.push({
      title: 'Kiểm tra sức khỏe',
      icon: faClipboardList,
      color: 'text-blue-700',
      description: 'Bạn chưa kiểm tra cholesterol trong 5 năm qua. Hãy đi xét nghiệm máu tổng quát sớm.',
      priority: 'medium'
    });
  }

  if (formData.AnyHealthcare === 0) {
    advice.push({
      title: 'Bảo hiểm y tế',
      icon: faIdCard,
      color: 'text-lime-600',
      description: 'Hãy cân nhắc tham gia BHYT để giảm gánh nặng chi phí khi cần điều trị y tế.',
      priority: 'low'
    });
  }

  if (formData.NoDocbcCost === 1) {
    advice.push({
      title: 'Hỗ trợ y tế',
      icon: faHandHoldingDollar,
      color: 'text-emerald-600',
      description: 'Đừng bỏ qua khám bệnh vì chi phí. Hãy tìm kiếm các chương trình hỗ trợ y tế cộng đồng.',
      priority: 'medium'
    });
  }

  const genHealth = formData.GenHlth || 3;
  if (genHealth >= 4) {
    advice.push({
      title: 'Cải thiện thể trạng',
      icon: faDumbbell,
      color: 'text-slate-600',
      description: 'Hãy bắt đầu với các thay đổi nhỏ: ngủ đủ giấc, uống đủ nước và vận động nhẹ mỗi ngày.',
      priority: 'medium'
    });
  }

  if (prediction === 0 && advice.length === 0) {
    advice.push({
      title: 'Tuyệt vời!',
      icon: faCheckCircle,
      color: 'text-green-500',
      description: 'Các chỉ số của bạn rất tốt. Hãy tiếp tục duy trì lối sống lành mạnh này nhé!',
      priority: 'low'
    });
  }

  return advice.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}