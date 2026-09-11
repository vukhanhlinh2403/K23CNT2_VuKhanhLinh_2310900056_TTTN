import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Trợ lý AI hỗ trợ tuyển sinh
            </h1>

            <p className="mt-6 text-lg md:text-xl text-blue-100">
              Giải đáp nhanh chóng các thông tin về
              tuyển sinh, ngành học, học phí và
              chương trình đào tạo.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/chatbot"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100"
              >
                Hỏi AI ngay
              </Link>

              <Link
                to="/admission"
                className="px-6 py-3 border border-white rounded-lg font-semibold hover:bg-white/10"
              >
                Xem thông tin tuyển sinh
              </Link>

            </div>

          </div>

        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">

        <h2 className="text-3xl font-bold text-center">
          Bạn có thể hỏi AI
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold">
              Ngành học
            </h3>

            <p className="mt-3 text-gray-600">
              Tìm hiểu các ngành đào tạo,
              chương trình học và cơ hội nghề nghiệp.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold">
              Tuyển sinh
            </h3>

            <p className="mt-3 text-gray-600">
              Tra cứu phương thức tuyển sinh,
              điều kiện xét tuyển và thời gian.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-xl font-semibold">
              Học phí
            </h3>

            <p className="mt-3 text-gray-600">
              Tìm hiểu học phí và các chính sách
              hỗ trợ sinh viên.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;