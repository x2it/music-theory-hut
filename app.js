/**
 * 乐理小屋 - 核心交互逻辑
 * 包含：导航切换、音程计算、和弦查询、调式生成、AI问答、教程筛选
 */

// ===== 全局状态 =====
let currentSection = 'tools';

// ===== 导航切换 =====
function switchSection(sectionId) {
    // 隐藏所有section
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 显示目标section
    document.getElementById(sectionId).classList.add('active');
    currentSection = sectionId;
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.section === sectionId) {
            btn.classList.add('active');
        }
    });
    
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 导航按钮点击事件
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        switchSection(btn.dataset.section);
    });
});

// ===== 移动端菜单 =====
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// ===== Toast提示 =====
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ===== 音乐理论基础数据 =====
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const INTERVALS = {
    0: { name: '纯一度', abbr: 'P1', quality: '协和' },
    1: { name: '小二度', abbr: 'm2', quality: '不协和' },
    2: { name: '大二度', abbr: 'M2', quality: '不协和' },
    3: { name: '小三度', abbr: 'm3', quality: '协和' },
    4: { name: '大三度', abbr: 'M3', quality: '协和' },
    5: { name: '纯四度', abbr: 'P4', quality: '协和' },
    6: { name: '增四度/减五度', abbr: 'A4/d5', quality: '不协和' },
    7: { name: '纯五度', abbr: 'P5', quality: '协和' },
    8: { name: '小六度', abbr: 'm6', quality: '协和' },
    9: { name: '大六度', abbr: 'M6', quality: '协和' },
    10: { name: '小七度', abbr: 'm7', quality: '不协和' },
    11: { name: '大七度', abbr: 'M7', quality: '不协和' },
    12: { name: '纯八度', abbr: 'P8', quality: '协和' }
};

const CHORD_FORMULAS = {
    'major': { name: '大三和弦', notes: [0, 4, 7], description: '明亮、稳定，流行音乐中最常用的和弦' },
    'minor': { name: '小三和弦', notes: [0, 3, 7], description: '忧伤、柔和，与大三和弦形成明暗对比' },
    'dim': { name: '减三和弦', notes: [0, 3, 6], description: '紧张、不稳定，常用于过渡和声' },
    'aug': { name: '增三和弦', notes: [0, 4, 8], description: '扩张感、悬疑，较少独立使用' },
    'maj7': { name: '大七和弦', notes: [0, 4, 7, 11], description: '明亮中带爵士色彩，常见于流行与爵士' },
    'min7': { name: '小七和弦', notes: [0, 3, 7, 10], description: '柔和、放松，爵士与R&B常用' },
    'dom7': { name: '属七和弦', notes: [0, 4, 7, 10], description: '强烈的解决倾向，经典终止式核心' },
    'min7b5': { name: '半减七和弦', notes: [0, 3, 6, 10], description: '爵士ii-V-I中的ii级，极具特色' },
    'dim7': { name: '减七和弦', notes: [0, 3, 6, 9], description: '极度紧张，常用于转调和戏剧效果' },
    'sus4': { name: '挂四和弦', notes: [0, 5, 7], description: '开放性、悬而未决，现代音乐常用' }
};

const SCALE_PATTERNS = {
    'major': { name: '自然大调', pattern: [0, 2, 4, 5, 7, 9, 11], description: '明亮、稳定，西方音乐的基础调式' },
    'minor': { name: '自然小调', pattern: [0, 2, 3, 5, 7, 8, 10], description: '忧伤、内敛，与同名大调形成关系' },
    'harmonicMinor': { name: '和声小调', pattern: [0, 2, 3, 5, 7, 8, 11], description: '升高第7级，强化属和弦的解决倾向' },
    'melodicMinor': { name: '旋律小调', pattern: [0, 2, 3, 5, 7, 9, 11], description: '上行升高6、7级，下行还原，旋律更流畅' },
    'dorian': { name: '多利亚调式', pattern: [0, 2, 3, 5, 7, 9, 10], description: '小调色彩但升6级，常用于爵士与民谣' },
    'phrygian': { name: '弗里几亚调式', pattern: [0, 1, 3, 5, 7, 8, 10], description: '降2级带来异域色彩，金属与电子音乐常用' },
    'lydian': { name: '利底亚调式', pattern: [0, 2, 4, 6, 7, 9, 11], description: '升4级带来梦幻感，影视配乐与爵士常用' },
    'mixolydian': { name: '混合利底亚', pattern: [0, 2, 4, 5, 7, 9, 10], description: '降7级带来布鲁斯色彩，摇滚与流行常用' },
    'locrian': { name: '洛克里亚调式', pattern: [0, 1, 3, 5, 6, 8, 10], description: '降2级和降5级，极度不稳定，极少独立使用' },
    'pentatonicMajor': { name: '大调五声音阶', pattern: [0, 2, 4, 7, 9], description: '五个音简洁明快，中国传统音乐与流行即兴常用' },
    'pentatonicMinor': { name: '小调五声音阶', pattern: [0, 3, 5, 7, 10], description: ' Blues与摇滚吉他独奏的核心音阶' },
    'blues': { name: '布鲁斯音阶', pattern: [0, 3, 5, 6, 7, 10], description: '降5级（蓝调音）是灵魂，爵士与蓝调的核心' }
};

const SCALE_DEGREE_NAMES = ['主音(I)', '上主音(II)', '中音(III)', '下属音(IV)', '属音(V)', '下中音(VI)', '导音(VII)'];

// ===== 音程计算器 =====
function getNoteIndex(noteName) {
    const sharpIndex = NOTE_NAMES.indexOf(noteName);
    if (sharpIndex !== -1) return sharpIndex;
    return NOTE_NAMES_FLAT.indexOf(noteName);
}

function getNoteName(index) {
    return NOTE_NAMES[index % 12];
}

function calculateInterval() {
    const note1 = document.getElementById('intervalNote1').value;
    const note2 = document.getElementById('intervalNote2').value;
    
    const idx1 = getNoteIndex(note1);
    const idx2 = getNoteIndex(note2);
    
    let semitones = (idx2 - idx1 + 12) % 12;
    
    // 判断上下行
    let direction = '上行';
    if (idx2 < idx1 || (idx2 === idx1 && note1 !== note2)) {
        // 如果需要处理八度以上，暂时简化
    }
    
    const interval = INTERVALS[semitones];
    
    const resultDiv = document.getElementById('intervalResult');
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>${note1} → ${note2}</h4>
            <div class="detail-row">
                <span class="detail-label">音程名称</span>
                <span class="detail-value">${interval.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">缩写</span>
                <span class="detail-value">${interval.abbr}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">半音数</span>
                <span class="detail-value">${semitones} 个半音</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">性质</span>
                <span class="detail-value">${interval.quality}</span>
            </div>
            <div style="margin-top:12px; padding:10px; background:rgba(99,102,241,0.05); border-radius:8px; font-size:13px; color:#64748b;">
                ${interval.quality === '协和' 
                    ? '这是一个协和音程，听起来稳定、融合。' 
                    : semitones === 6 
                        ? '增四度/减五度（三全音）被称为"魔鬼音程"，极度不协和，但也是爵士与重金属制造张力的核心。'
                        : '这是一个不协和音程，听起来有张力、需要解决。'}
            </div>
        </div>
    `;
}

// ===== 和弦查询器 =====
function lookupChord() {
    const root = document.getElementById('chordRoot').value;
    const type = document.getElementById('chordType').value;
    
    const formula = CHORD_FORMULAS[type];
    const rootIndex = getNoteIndex(root);
    
    // 计算构成音
    const notes = formula.notes.map(semitone => {
        const noteIdx = (rootIndex + semitone) % 12;
        return getNoteName(noteIdx);
    });
    
    // 生成转位信息
    const inversions = [
        { name: '原位', bass: notes[0] },
        ...(notes[1] ? [{ name: '第一转位', bass: notes[1] }] : []),
        ...(notes[2] ? [{ name: '第二转位', bass: notes[2] }] : []),
        ...(notes[3] ? [{ name: '第三转位', bass: notes[3] }] : [])
    ];
    
    const resultDiv = document.getElementById('chordResult');
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>${root}${type === 'major' ? '' : type === 'minor' ? 'm' : type === 'dim' ? 'dim' : type === 'aug' ? 'aug' : type === 'maj7' ? 'maj7' : type === 'min7' ? 'm7' : type === 'dom7' ? '7' : type === 'min7b5' ? 'm7b5' : type === 'dim7' ? 'dim7' : 'sus4'} 和弦</h4>
            <div style="margin:12px 0;">
                <span style="color:#64748b; font-size:13px;">构成音：</span>
                <div class="note-list">
                    ${notes.map(n => `<span class="note-tag">${n}</span>`).join('')}
                </div>
            </div>
            <div class="detail-row">
                <span class="detail-label">和弦性质</span>
                <span class="detail-value">${formula.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">音数</span>
                <span class="detail-value">${notes.length}个音</span>
            </div>
            <div style="margin-top:12px; padding:10px; background:rgba(99,102,241,0.05); border-radius:8px; font-size:13px; color:#64748b;">
                ${formula.description}
            </div>
            ${inversions.length > 1 ? `
            <div style="margin-top:12px;">
                <span style="color:#64748b; font-size:13px;">转位形式：</span>
                <div style="margin-top:6px; font-size:13px;">
                    ${inversions.map(inv => `<div style="padding:4px 0; border-bottom:1px solid #e2e8f0;"><strong>${inv.name}</strong>：低音为 ${inv.bass}</div>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

// ===== 调式生成器 =====
function generateScale() {
    const root = document.getElementById('scaleRoot').value;
    const type = document.getElementById('scaleType').value;
    
    const scale = SCALE_PATTERNS[type];
    const rootIndex = getNoteIndex(root);
    
    // 生成音阶音符
    const notes = scale.pattern.map((semitone, index) => {
        const noteIdx = (rootIndex + semitone) % 12;
        return {
            note: getNoteName(noteIdx),
            degree: index < 7 ? SCALE_DEGREE_NAMES[index] : ''
        };
    });
    
    const resultDiv = document.getElementById('scaleResult');
    resultDiv.innerHTML = `
        <div class="result-content">
            <h4>${root} ${scale.name}</h4>
            <div style="margin:12px 0;">
                <span style="color:#64748b; font-size:13px;">音阶音符：</span>
                <div class="note-list">
                    ${notes.map((n, i) => `<span class="note-tag" title="${n.degree}">${n.note}${i < notes.length - 1 ? '' : ''}</span>`).join('')}
                </div>
            </div>
            <div class="detail-row">
                <span class="detail-label">音数</span>
                <span class="detail-value">${notes.length}个音</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">调式特征</span>
                <span class="detail-value">${type.includes('Minor') || type === 'dorian' || type === 'phrygian' || type === 'locrian' ? '小调色彩' : type === 'major' || type === 'lydian' || type === 'mixolydian' ? '大调色彩' : '中性/特殊'}</span>
            </div>
            <div style="margin-top:12px; padding:10px; background:rgba(99,102,241,0.05); border-radius:8px; font-size:13px; color:#64748b;">
                ${scale.description}
            </div>
            <div style="margin-top:12px;">
                <span style="color:#64748b; font-size:13px;">级数名称：</span>
                <div style="margin-top:6px; font-size:13px; line-height:1.8;">
                    ${notes.slice(0, 7).map((n, i) => `<div>${n.note} - ${SCALE_DEGREE_NAMES[i]}</div>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// ===== AI问答助手 =====
const AI_KNOWLEDGE_BASE = {
    '大三度': {
        answer: '**大三度（Major Third）**是包含4个半音的音程。\n\n例如：C → E 就是大三度。\n\n**特点**：明亮、开放，是大三和弦的基础。在C大调中，Do-Mi就是大三度。'
    },
    '小三度': {
        answer: '**小三度（Minor Third）**是包含3个半音的音程。\n\n例如：C → Eb 就是小三度。\n\n**特点**：忧伤、柔和，是小三和弦的基础。在C小调中，Do-Me就是小三度。'
    },
    '升降号': {
        answer: '**升降号**是变音记号：\n\n- **升号（#）**：将音升高半音，如 C → C#\n- **降号（b）**：将音降低半音，如 C → Cb（即B）\n- **还原号（♮）**：取消升降，还原为本位音\n\n调号中的升降号写在谱号后面，表示该调中所有同名音都要升降。'
    },
    '属七和弦': {
        answer: '**属七和弦（Dominant 7th）**是以属音（V级）为根音构建的七和弦。\n\n在C大调中，属音是G，所以属七和弦是 **G7**：G - B - D - F\n\n**特点**：\n- 包含大三度+纯五度+小七度\n- 极度不稳定，有强烈的解决到主和弦的倾向\n- 是古典音乐终止式（V7 → I）的核心\n- 爵士、布鲁斯、流行音乐中无处不在'
    },
    'ii-V-I': {
        answer: '**ii-V-I**是爵士与流行音乐中最经典的和弦进行。\n\n在C大调中：\n- **ii级**：Dm7（D - F - A - C）\n- **V级**：G7（G - B - D - F）\n- **I级**：Cmaj7（C - E - G - B）\n\n**为什么好听**：\n1. ii → V：五度下行，自然的和声推动力\n2. V7 → I：属七和弦的解决感\n3. 循环往复，适合即兴演奏\n\n变体：ii-V-I → iii-vi-ii-V（ turnaround）'
    },
    '五度圈': {
        answer: '**五度圈（Circle of Fifths）**是音乐理论中最重要的工具之一。\n\n**构造**：按纯五度关系排列的12个调：\nC → G → D → A → E → B → F# → C# → G# → D# → A# → F → C\n\n**用途**：\n1. **找调号**：顺时针每步+1个升号，逆时针每步+1个降号\n2. **找关系调**：相邻调关系最近（如C和G）\n3. **和弦进行**：五度进行是最自然的和声运动\n4. **调性转换**：顺时针转调增加紧张感，逆时针转调增加放松感'
    }
};

// 扩展知识库 - 关键词匹配
const AI_KEYWORDS = {
    '大调': '大调（Major）以Do为主音，音程结构为：全-全-半-全-全-全-半。听起来明亮、稳定，是西方音乐的基础。',
    '小调': '小调（Minor）以La为主音，音程结构为：全-半-全-全-半-全-全。听起来忧伤、内敛。自然小调、和声小调、旋律小调三种形式各有特色。',
    '音阶': '音阶是按音高顺序排列的一组音符。常见音阶包括：自然大调、自然小调、和声小调、旋律小调、五声音阶、布鲁斯音阶、各种教会调式等。',
    '节拍': '节拍是音乐的时间组织。常见拍号：\n- 4/4拍：每小节4拍，最常用（进行曲、流行）\n- 3/4拍：每小节3拍（华尔兹）\n- 6/8拍：每小节6拍，分组为2组（摇摆感）\n- 2/4拍：每小节2拍（进行曲）',
    '拍号': '拍号写在谱号后面，上面的数字表示每小节的拍数，下面的数字表示以什么音符为一拍。\n\n例如 4/4：每小节4拍，四分音符为一拍。',
    '和弦': '和弦是三个或以上音按三度关系叠置。\n\n三和弦：根音+三度音+五度音\n- 大三和弦：大三度+纯五度（明亮）\n- 小三和弦：小三度+纯五度（忧伤）\n- 减三和弦：小三度+减五度（紧张）\n- 增三和弦：大三度+增五度（扩张）',
    '转位': '和弦转位是将和弦音重新排列，低音不再是根音。\n\n- 原位：根音在最低声部\n- 第一转位：三音在最低声部（六和弦）\n- 第二转位：五音在最低声部（四六和弦）\n- 第三转位：七音在最低声部（二和弦，仅七和弦）',
    '调式': '调式是音阶的特定排列方式，每种调式有不同的色彩。\n\n教会调式：\n- Ionian（大调）：明亮\n- Dorian：小调+升6级，爵士感\n- Phrygian：小调+降2级，异域感\n- Lydian：大调+升4级，梦幻感\n- Mixolydian：大调+降7级，布鲁斯感\n- Aeolian（小调）：忧伤\n- Locrian：极不稳定',
    '十二平均律': '十二平均律将八度均分为12个半音，每个半音频率比为2^(1/12) ≈ 1.059。\n\n这是现代音乐的基础调律系统，使所有调都能自由转调。巴赫的《平均律钢琴曲集》就是为证明其优越性而作。',
    '五线谱': '五线谱由五条平行横线组成，从下往上数。\n\n- 谱号：高音谱号(G谱号)、低音谱号(F谱号)、中音谱号(C谱号)\n- 线间关系：线和间交替，相邻线/间为二度关系\n- 加线：超出五线范围时，上加线或下加线',
    '视唱': '视唱是看着乐谱直接唱出音符的能力。训练方法：\n\n1. 固定do唱名法：C永远唱do\n2. 首调唱名法：任何调的主音唱do\n3. 音程模唱：先听标准音，再唱指定音程\n4. 旋律听写：听旋律后写出乐谱',
    '练耳': '练耳（Ear Training）是训练耳朵分辨音高、音程、和弦、节奏的能力。\n\n训练层次：\n1. 单音听辨 → 2. 音程听辨 → 3. 和弦听辨 → 4. 旋律听写 → 5. 和声听辨\n\n推荐工具：EarMaster、Complete Ear Trainer、Teoria',
    '装饰音': '装饰音是美化旋律的辅助音符：\n\n- 倚音（Appoggiatura）：强拍上的装饰音，占用主音时值\n- 波音（Mordent）：快速往返主音和邻音\n- 回音（Turn）：围绕主音的四个音型\n- 颤音（Trill）：快速交替主音和上方邻音',
    '终止式': '终止式是乐句或乐段的结束方式：\n\n1. 正格终止（Authentic）：V → I（最强烈）\n2. 变格终止（Plagal）：IV → I（阿门终止）\n3. 半终止（Half）：任何和弦 → V（未完待续）\n4. 阻碍终止（Deceptive）：V → vi（出乎意料）',
    '复调': '复调（Polyphony）是多条独立旋律同时进行。\n\n与主调音乐（Homophony）的区别：\n- 主调：一条旋律+伴奏（如流行音乐）\n- 复调：多条旋律平等重要（如巴赫赋格）\n\n技法：对位法、卡农、赋格、模仿',
    '对位法': '对位法（Counterpoint）是复调音乐的写作规则，研究多条旋律线的关系。\n\n基本原则：\n1. 协和音程为主，不协和音程需解决\n2. 避免平行五度/八度\n3. 各声部独立但有和声联系\n4. 考虑节奏互补，避免齐奏',
    '配器法': '配器法（Orchestration）是将音乐分配给不同乐器演奏的艺术。\n\n要点：\n1. 了解每种乐器的音域、音色、演奏技法\n2. 平衡各声部的音量和音色\n3. 合理安排音区，避免声部交叉混乱\n4. 考虑乐器的特殊效果（泛音、拨奏、弱音器等）',
    '混音': '混音（Mixing）是将多个音轨平衡融合为立体声成品的过程。\n\n核心操作：\n1. 音量平衡（Volume）\n2. 声像定位（Pan）\n3. 均衡（EQ）：切除冲突频率\n4. 压缩（Compression）：控制动态\n5. 混响（Reverb）：营造空间感\n6. 自动化（Automation）：随时间变化参数',
    'MIDI': 'MIDI（Musical Instrument Digital Interface）是音乐设备的数字通信协议。\n\n不是音频！而是指令：\n- Note On/Off：音符开关\n- Velocity：力度（0-127）\n- Pitch Bend：弯音\n- Modulation：调制\n- CC（Control Change）：控制变化\n\n优势：文件小、可编辑、可换音色',
    'DAW': 'DAW（Digital Audio Workstation）是数字音频工作站，音乐制作的中心软件。\n\n主流DAW：\n- Ableton Live：电子音乐、现场演出\n- Logic Pro：苹果生态，编曲强大\n- Cubase：老牌全能，影视配乐常用\n- FL Studio：电子音乐、Hip-hop\n- Pro Tools：行业标准，录音混音\n- Studio One：新兴， workflow优秀',
    '编曲': '编曲（Arranging）是为现有旋律配置和声、节奏、音色和结构的过程。\n\n层次：\n1. 确定歌曲结构（前奏-主歌-副歌-间奏-尾奏）\n2. 选择和声进行\n3. 设计节奏型（鼓组、贝斯）\n4. 铺底音色（Pad、弦乐）\n5. 点缀音色（琶音、FX、SFX）\n6. 混音与母带处理',
    '爵士': '爵士乐（Jazz）起源于美国新奥尔良，核心是即兴演奏。\n\n核心元素：\n- Swing节奏：三连音感觉\n- ii-V-I进行：最常见的和声框架\n- 蓝调音阶：降3级、降5级、降7级\n- 扩展和弦：9、11、13和弦\n- 调式爵士：以调式而非和弦进行即兴',
    '布鲁斯': '布鲁斯（Blues）起源于美国非裔社区，以12小节形式为核心。\n\n12小节布鲁斯（C调）：\n| C7 | C7 | C7 | C7 |\n| F7 | F7 | C7 | C7 |\n| G7 | F7 | C7 | G7 |\n\n特征：\n- 蓝调音阶（降3、降5、降7）\n- 呼应式演唱（Call and Response）\n- 情感表达重于技巧',
    '摇滚': '摇滚乐（Rock）以电吉他、贝斯、鼓为核心，强调节奏与力量。\n\n核心元素：\n- 强力和弦（Power Chords）：根音+五音，无三音\n- 失真音色（Distortion）\n- 4/4拍，重音在第2、4拍（反拍）\n- 简单有力的和声进行\n- 主歌-副歌结构，副歌有记忆点',
    '古典': '古典音乐（Classical）指西方艺术音乐传统，约1750-1820年为古典主义时期。\n\n时期划分：\n- 巴洛克（1600-1750）：巴赫、维瓦尔第，复调为主\n- 古典主义（1750-1820）：莫扎特、海顿、贝多芬，主调确立\n- 浪漫主义（1820-1900）：肖邦、李斯特、柴可夫斯基，情感表达\n- 现代（1900-）：斯特拉文斯基、勋伯格，无调性、序列主义',
    '音乐': '音乐是组织声音的艺术形式，通过音高、节奏、音色、力度等元素表达情感与思想。\n\n学习音乐的层次：\n1. 乐理基础（识谱、音程、和弦）\n2. 乐器演奏（技巧+音乐性）\n3. 视唱练耳（听辨+演唱）\n4. 和声学（多声部写作）\n5. 曲式分析（理解作品结构）\n6. 编曲制作（创作自己的音乐）'
};

function findBestAnswer(question) {
    // 先精确匹配知识库
    for (const [key, value] of Object.entries(AI_KNOWLEDGE_BASE)) {
        if (question.includes(key)) {
            return value.answer;
        }
    }
    
    // 再关键词匹配
    for (const [keyword, answer] of Object.entries(AI_KEYWORDS)) {
        if (question.includes(keyword)) {
            return answer;
        }
    }
    
    // 尝试模糊匹配
    const keywords = Object.keys(AI_KEYWORDS);
    for (const kw of keywords) {
        // 检查问题中是否包含关键词的部分
        for (let i = 0; i < kw.length - 1; i++) {
            if (question.includes(kw.substring(i, i + 2))) {
                return AI_KEYWORDS[kw];
            }
        }
    }
    
    // 默认回复
    return `这个问题很有意思！\n\n目前我的知识库中关于"${question}"的详细解答还在完善中。\n\n你可以尝试问我这些常见问题：\n- "什么是大三度？"\n- "属七和弦是什么？"\n- "ii-V-I是什么意思？"\n- "五度圈是什么？"\n- "大调和小调有什么区别？"\n\n或者你可以描述得更具体一些，我会尽力帮助你！`;
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const question = input.value.trim();
    
    if (!question) return;
    
    // 添加用户消息
    addMessage(question, 'user');
    
    // 清空输入
    input.value = '';
    
    // 模拟AI思考延迟
    setTimeout(() => {
        const answer = findBestAnswer(question);
        addMessage(answer, 'ai');
    }, 800);
}

function sendQuickQuestion(question) {
    document.getElementById('chatInput').value = question;
    sendChatMessage();
}

function addMessage(text, sender) {
    const container = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = sender === 'ai' ? '&#129302;' : '&#128100;';
    
    // 处理Markdown样式（简单的）
    let formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">${formattedText}</div>
    `;
    
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

// ===== 教程筛选 =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 更新按钮状态
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        
        // 筛选卡片
        document.querySelectorAll('.tutorial-card').forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== 教程按钮点击 =====
document.querySelectorAll('.tutorial-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        showToast('教程内容正在制作中，敬请期待！在实际部署中将跳转到具体课程页面。');
    });
});

// ===== 页面加载完成后的初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    // 默认显示工具箱
    switchSection('tools');
    
    // 预计算一些示例
    console.log('乐理小屋已加载完成！');
});
