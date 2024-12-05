const Footer = () => {
    const currentYear = new Date().getFullYear();
    return ( 
        <footer>
            <p>Pracownia Dyplomowa - Praca Inżynierska</p>
            <p>© {currentYear} Wszelkie prawa zastrzeżone</p>
        </footer>
     );
}
 
export default Footer;