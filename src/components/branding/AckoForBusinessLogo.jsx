import logoSrc from '../../assets/branding/acko-for-business-white.png'

export default function AckoForBusinessLogo({ className = '', alt = 'ACKO for Business' }) {
  return <img src={logoSrc} alt={alt} className={className} decoding="async" />
}
