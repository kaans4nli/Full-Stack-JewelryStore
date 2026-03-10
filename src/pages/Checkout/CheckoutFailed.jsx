import { useSearchParams, useNavigate } from "react-router-dom";

export default function CheckoutFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 px-4">
      <div className="bg-white/90 rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center font-primary">
        <h1 className="text-5xl font-bold mb-4 text-red-500">
          ❌ Ödeme Başarısız!
        </h1>
        <p className="text-xl text-primary mb-6">
          Siparişiniz #{orderId} tamamlanamadı.
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Lütfen kart bilgilerinizi kontrol edin veya farklı bir ödeme yöntemi deneyin.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/checkout")}
            className="btn btn-primary py-3 text-lg font-semibold"
          >
            Tekrar Ödeme Yap
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn btn-outline py-3 text-lg font-semibold"
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}