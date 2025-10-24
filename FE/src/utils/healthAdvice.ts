// Hệ thống lời khuyên sức khỏe dựa trên kết quả và chỉ số

export interface HealthAdvice {
  title: string;
  icon: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function generateHealthAdvice(
  prediction: number,
  formData: Record<string, number>
): HealthAdvice[] {
  const advice: HealthAdvice[] = [];

  // Kết quả dự đoán
  if (prediction === 1) {
    advice.push({
      title: 'Khám bác sĩ ngay',
      icon: '🏥',
      description: 'Kết quả cho thấy nguy cơ tiểu đường. Hãy đặt lịch khám với bác sĩ chuyên khoa nội tiết để được tư vấn và xét nghiệm chuyên sâu.',
      priority: 'high'
    });
  }

  // BMI
  const bmi = formData.BMI || 0;
  if (bmi >= 30) {
    advice.push({
      title: 'Giảm cân',
      icon: '⚖️',
      description: `BMI của bạn là ${bmi.toFixed(1)} (béo phì). Hãy xây dựng chế độ ăn uống lành mạnh và tập luyện đều đặn. Mục tiêu giảm 5-10% cân nặng sẽ giảm đáng kể nguy cơ tiểu đường.`,
      priority: 'high'
    });
  } else if (bmi >= 25) {
    advice.push({
      title: 'Kiểm soát cân nặng',
      icon: '⚖️',
      description: `BMI của bạn là ${bmi.toFixed(1)} (thừa cân). Duy trì cân nặng ổn định và tăng cường vận động để tránh béo phì.`,
      priority: 'medium'
    });
  }

  // Hoạt động thể chất
  if (formData.PhysActivity === 0) {
    advice.push({
      title: 'Tăng cường vận động',
      icon: '🏃',
      description: 'Hãy tập thể dục ít nhất 150 phút/tuần (30 phút/ngày, 5 ngày/tuần). Đi bộ, bơi lội, đạp xe đều rất tốt cho sức khỏe và giảm nguy cơ tiểu đường.',
      priority: 'high'
    });
  }

  // Chế độ ăn uống
  if (formData.Fruits === 0 || formData.Veggies === 0) {
    const missing = [];
    if (formData.Fruits === 0) missing.push('hoa quả');
    if (formData.Veggies === 0) missing.push('rau xanh');
    
    advice.push({
      title: 'Cải thiện chế độ ăn',
      icon: '🥗',
      description: `Bạn chưa ăn đủ ${missing.join(' và ')}. Hãy bổ sung ít nhất 5 phần rau củ quả mỗi ngày để cung cấp vitamin, chất xơ và chống oxy hóa.`,
      priority: 'high'
    });
  }

  // Huyết áp cao
  if (formData.HighBP === 1) {
    advice.push({
      title: 'Kiểm soát huyết áp',
      icon: '💊',
      description: 'Huyết áp cao làm tăng nguy cơ biến chứng tim mạch và thận. Uống thuốc đều đặn theo chỉ định, giảm muối, tăng kali (chuối, khoai tây) và tập thể dục.',
      priority: 'high'
    });
  }

  // Cholesterol cao
  if (formData.HighChol === 1) {
    advice.push({
      title: 'Kiểm soát cholesterol',
      icon: '🫀',
      description: 'Giảm thực phẩm giàu chất béo bão hòa (thịt đỏ, bơ, phô mai). Ăn nhiều cá hồi, hạt óc chó, dầu ô liu. Xem xét dùng thuốc statin nếu bác sĩ chỉ định.',
      priority: 'high'
    });
  }

  // Hút thuốc
  if (formData.Smoker === 1) {
    advice.push({
      title: 'Bỏ thuốc lá',
      icon: '🚭',
      description: 'Hút thuốc làm tăng nguy cơ tiểu đường type 2 và các biến chứng tim mạch. Hãy tham khảo chương trình cai thuốc hoặc dùng liệu pháp thay thế nicotine.',
      priority: 'high'
    });
  }

  // Rượu bia
  if (formData.HvyAlcoholConsump === 1) {
    advice.push({
      title: 'Giảm rượu bia',
      icon: '🍺',
      description: 'Uống nhiều rượu bia làm tăng cân, tăng nguy cơ tiểu đường và gan nhiễm mỡ. Hãy giảm xuống mức an toàn: Nam <14 ly/tuần, Nữ <7 ly/tuần.',
      priority: 'medium'
    });
  }

  // Tiền sử tim mạch
  if (formData.HeartDiseaseorAttack === 1 || formData.Stroke === 1) {
    advice.push({
      title: 'Theo dõi tim mạch',
      icon: '❤️',
      description: 'Tiền sử bệnh tim/đột quỵ cần được quản lý chặt chẽ. Khám định kỳ, uống thuốc đúng giờ, kiểm soát huyết áp, cholesterol và đường huyết.',
      priority: 'high'
    });
  }

  // Sức khỏe tinh thần
  const mentalHealth = formData.MentHlth || 0;
  if (mentalHealth >= 15) {
    advice.push({
      title: 'Chăm sóc sức khỏe tinh thần',
      icon: '🧠',
      description: `Bạn có ${mentalHealth} ngày tinh thần không tốt trong tháng. Stress và trầm cảm ảnh hưởng đến đường huyết. Hãy tìm sự hỗ trợ từ chuyên gia tâm lý hoặc thực hành thiền, yoga.`,
      priority: 'medium'
    });
  }

  // Sức khỏe thể chất
  const physHealth = formData.PhysHlth || 0;
  if (physHealth >= 15) {
    advice.push({
      title: 'Khám sức khỏe tổng quát',
      icon: '🩺',
      description: `Bạn có ${physHealth} ngày sức khỏe thể chất không tốt. Hãy đi khám để tìm nguyên nhân và điều trị kịp thời.`,
      priority: 'medium'
    });
  }

  // Khó khăn đi lại
  if (formData.DiffWalk === 1) {
    advice.push({
      title: 'Vật lý trị liệu',
      icon: '🦽',
      description: 'Khó khăn khi đi lại có thể do viêm khớp, bệnh lý thần kinh hoặc béo phì. Tham khảo bác sĩ về liệu pháp vật lý, bơi lội hoặc tập yoga nhẹ nhàng.',
      priority: 'medium'
    });
  }

  // Kiểm tra sức khỏe định kỳ
  if (formData.CholCheck === 0) {
    advice.push({
      title: 'Kiểm tra sức khỏe định kỳ',
      icon: '📋',
      description: 'Bạn chưa kiểm tra cholesterol trong 5 năm qua. Hãy đi xét nghiệm máu để theo dõi lipid máu, đường huyết, chức năng gan thận.',
      priority: 'medium'
    });
  }

  // Không có bảo hiểm y tế
  if (formData.AnyHealthcare === 0) {
    advice.push({
      title: 'Đăng ký bảo hiểm y tế',
      icon: '🏥',
      description: 'Bảo hiểm y tế giúp bạn tiếp cận dịch vụ y tế, khám định kỳ và điều trị khi cần. Hãy tìm hiểu các gói bảo hiểm phù hợp.',
      priority: 'low'
    });
  }

  // Bỏ khám vì chi phí
  if (formData.NoDocbcCost === 1) {
    advice.push({
      title: 'Tìm hỗ trợ y tế',
      icon: '💰',
      description: 'Nhiều bệnh viện có chương trình hỗ trợ chi phí cho người thu nhập thấp. Đừng bỏ qua khám bệnh vì chi phí - sức khỏe là quan trọng nhất.',
      priority: 'medium'
    });
  }

  // Sức khỏe tổng quát kém
  const genHealth = formData.GenHlth || 3;
  if (genHealth >= 4) {
    advice.push({
      title: 'Cải thiện sức khỏe tổng quát',
      icon: '💪',
      description: 'Sức khỏe tổng quát của bạn cần cải thiện. Hãy bắt đầu với các bước nhỏ: đi bộ 10 phút/ngày, uống đủ nước, ngủ đủ 7-8 tiếng, giảm stress.',
      priority: 'medium'
    });
  }

  // Lời khuyên chung nếu không có nguy cơ
  if (prediction === 0 && advice.length === 0) {
    advice.push({
      title: 'Duy trì lối sống lành mạnh',
      icon: '🌟',
      description: 'Kết quả của bạn rất tốt! Hãy tiếp tục duy trì chế độ ăn uống cân bằng, tập thể dục đều đặn và khám sức khỏe định kỳ mỗi năm.',
      priority: 'low'
    });
  }

  // Sắp xếp theo độ ưu tiên
  return advice.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

