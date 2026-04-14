<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // Honeypot – jeśli wypełnione, to spam
    if (!empty($_POST["firma"])) {
        header("Location: https://irondeer.pl/?error=true#kontakt");
        exit;
    }

    // Odbiorca
    $to = "irondeer.rentals@gmail.com";
    $subject = "Nowa wiadomość z formularza Iron Deer";

    // Pobieranie i czyszczenie danych
    $name    = trim(strip_tags($_POST["Imię"] ?? ''));
    $phone   = trim(strip_tags($_POST["Telefon"] ?? ''));
    $email_raw = trim($_POST["Email"] ?? '');
    $message_content = trim(strip_tags($_POST["Wiadomość"] ?? ''));

    // Walidacja e-maila
    $email = filter_var($email_raw, FILTER_VALIDATE_EMAIL);
    if (!$email) {
        header("Location: https://irondeer.pl/?error=invalid_email#kontakt");
        exit;
    }

    // Treść wiadomości
    $message = 
        "Imię: $name\n" .
        "Telefon: $phone\n" .
        "Email: $email\n\n" .
        "Wiadomość:\n$message_content\n";

    // Nagłówki
    $boundary = md5(time());

    $headers = "From: kontakt@irondeer.pl\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";

    // BODY główny (tekst)
    $body = "--$boundary\r\n";
    $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
    $body .= $message . "\r\n";

    // Obsługa załącznika (opcjonalna)
    if (isset($_FILES["Załącznik"]) && $_FILES["Załącznik"]["error"] === UPLOAD_ERR_OK) {

        $file_tmp  = $_FILES["Załącznik"]["tmp_name"];
        $file_name = basename($_FILES["Załącznik"]["name"]);
        $file_type = $_FILES["Załącznik"]["type"] ?: "application/octet-stream";
        $file_data = chunk_split(base64_encode(file_get_contents($file_tmp)));

        // Kodowanie nazwy pliku dla UTF-8
        $file_name_enc = '=?UTF-8?B?' . base64_encode($file_name) . '?=';

        $body .= "--$boundary\r\n";
        $body .= "Content-Type: $file_type; name=\"$file_name_enc\"\r\n";
        $body .= "Content-Disposition: attachment; filename=\"$file_name_enc\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $body .= $file_data . "\r\n";
    }

    // Zakończenie
    $body .= "--$boundary--\r\n";

    // Wysyłka
    if (mail($to, $subject, $body, $headers)) {
        header("Location: https://irondeer.pl/?success=true#kontakt");
    } else {
        header("Location: https://irondeer.pl/?error=true#kontakt");
    }
    exit;
}
?>

