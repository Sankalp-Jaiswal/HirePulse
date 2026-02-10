import { GoogleLogin } from "@react-oauth/google";
import Layout from "../components/Layout";

const Login = () => (
  <Layout>
    <div className="flex flex-col items-center justify-center mt-24">
      <h1 className="text-3xl font-bold mb-2">HirePulse</h1>
      <p className="text-gray-600 mb-6">
        AI-powered resume ranking system
      </p>

      <GoogleLogin
        onSuccess={(res) => {
          localStorage.setItem("google_token", res.credential);
          window.location.href = "/dashboard";
        }}
        onError={() => alert("Login failed")}
      />
    </div>
  </Layout>
);

export default Login;
