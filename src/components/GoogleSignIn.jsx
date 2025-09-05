import { GoogleLogin } from '@react-oauth/google';

const GoogleSignIn = () => {
  return (
    <div>
      <GoogleLogin
        onSuccess={credentialResponse => {
          window.location.href = `http://localhost:8080/oauth2/authorization/google`;
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
};

export default GoogleSignIn;
