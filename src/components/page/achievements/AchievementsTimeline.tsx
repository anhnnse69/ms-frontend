import YearBlock from "./YearBlock";


const VINMEC_BASE_URL = "https://www.vinmec.com";

// For i18n, texts should be passed as props or from t().
// Here, just update image URLs to use VINMEC_BASE_URL
const ACHIEVEMENTS = [
    {
        year: 2025,
        items: [
            {
                text: "Vinmec đạt giải thưởng quốc tế về chất lượng dịch vụ y tế.",
                image: `${VINMEC_BASE_URL}/static/uploads/wao_1a3e01ccd4.jpg`,
            },
            {
                text: "Bệnh viện Vinmec được công nhận là bệnh viện thông minh hàng đầu Việt Nam.",
                image: `${VINMEC_BASE_URL}/static/uploads/esg_5fcd773de4.jpg`,
            },
            {
                text: "Vinmec nhận giải thưởng đổi mới sáng tạo trong chăm sóc sức khỏe.",
                image: `${VINMEC_BASE_URL}/static/uploads/so_1_99eef52ab6.jpg`,
            },
        ],
    },
    {
        year: 2024,
        items: [
            {
                text: "Bệnh viện Vinmec đạt chứng nhận vàng JCI lần thứ 3 liên tiếp.",
                image: `${VINMEC_BASE_URL}/static/uploads/20181217_095947_862727_JCI_max_1800x1800_jpg_e9dad5929b.jpg`,
            },
            {
                text: "Vinmec triển khai thành công nhiều kỹ thuật y học tiên tiến.",
                image: `${VINMEC_BASE_URL}/static/uploads/vinmec1_f7b14bb00d.png`,
            },
        ],
    },
    {
        year: 2023,
        items: [
            {
                text: "Vinmec Times City được vinh danh trong top bệnh viện tốt nhất châu Á.",
                image: `${VINMEC_BASE_URL}/static/uploads/2023_1_6043ebd070.png`,
            },
        ],
    },
    {
        year: 2022,
        items: [
            {
                text: "Vinmec đạt chứng nhận RTAC quốc tế về hỗ trợ sinh sản.",
                image: `${VINMEC_BASE_URL}/static/uploads/Acc_7e1c3dd77d.png`,
            },
        ],
    },
    {
        year: 2021,
        items: [
            {
                text: "Vinmec nhận giải thưởng vàng chất lượng dịch vụ y tế.",
                image: `${VINMEC_BASE_URL}/static/uploads/jci_a2b22cbbfe.png`,
            },
        ],
    },
    {
        year: 2019,
        items: [
            {
                text: "Vinmec khai trương bệnh viện mới tại Hải Phòng.",
                image: `${VINMEC_BASE_URL}/static/uploads/2019_1_eb095491b5.jpg`,
            },
        ],
    },
    {
        year: 2018,
        items: [
            {
                text: "Vinmec đạt chứng nhận JCI lần thứ 2.",
                image: `${VINMEC_BASE_URL}/static/uploads/2018_1_84c97cd94c.png`,
            },
        ],
    },
    {
        year: 2017,
        items: [
            {
                text: "Vinmec mở rộng hệ thống bệnh viện trên toàn quốc.",
                image: `${VINMEC_BASE_URL}/static/uploads/2017_1_9db04cb4ea.png`,
            },
        ],
    },
    {
        year: 2016,
        items: [
            {
                text: "Vinmec đạt nhiều thành tựu trong nghiên cứu y học.",
                image: `${VINMEC_BASE_URL}/static/uploads/2016_1_f5b7fbab97.jpeg`,
            },
        ],
    },
    {
        year: 2015,
        items: [
            {
                text: "Khai trương Bệnh viện Đa khoa Quốc tế Vinmec Central Park.",
                image: `${VINMEC_BASE_URL}/static/uploads/2015_1_e0278ece7e.png`,
            },
        ],
    },
    {
        year: 2014,
        items: [
            {
                text: "Vinmec mở rộng mạng lưới bệnh viện tại miền Trung.",
                image: `${VINMEC_BASE_URL}/static/uploads/2014_1_6d7db1052e.jpg`,
            },
        ],
    },
    {
        year: 2013,
        items: [
            {
                text: "Vinmec Times City chính thức đi vào hoạt động.",
                image: `${VINMEC_BASE_URL}/static/uploads/2013_1_ab35326935.jpg`,
            },
        ],
    },
    {
        year: 2012,
        items: [
            {
                text: "Khai trương Bệnh viện Đa khoa Quốc tế Vinmec đầu tiên tại Hà Nội.",
                image: `${VINMEC_BASE_URL}/static/uploads/2012_1_b30d381dfc.png`,
            },
        ],
    },
];

export default function AchievementsTimeline() {
    return (
        // add legacy class names so index.html styles apply when present
        <section className="list_award_main tab-2" style={{ display: "block" }}>
            <div className="relative border-l-2 border-[#0076c0] ml-6 mt-8">
                {ACHIEVEMENTS.map((yearBlock) => (
                    <YearBlock key={yearBlock.year} year={yearBlock.year} items={yearBlock.items} />
                ))}
            </div>
        </section>
    );
}
