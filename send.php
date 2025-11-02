<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  // Honeypot: jeśli pole "firma" jest wypełnione, to spam
  if (!empty($_POST["firma"])) {
    header("Location: https://irondeer.pl/?error=true#kontakt");
    exit;
  }

  $to = "irondeer.rentals@gmail.com";
  $subject = "Nowa wiadomość z formularza Iron Deer";

  // Filtrowanie danych
  $name = filter_var($_POST["Imię"] ?? '', FILTER_SANITIZE_STRING);
  $phone = filter_var($_POST["Telefon"] ?? '', FILTER_SANITIZE_STRING);
  $email = filter_var(trim($_POST["Email"] ?? ''), FILTER_VALIDATE_EMAIL);
  $message_content = filter_var($_POST["Wiadomość"] ?? '', FILTER_SANITIZE_STRING);

  // Walidacja e-maila
  if (!$email) {
    header("Location: https://irondeer.pl/?error=invalid_email#kontakt");
    exit;
  }

  // Treść wiadomości
  $message = "Imię: $name\n"
           . "Telefon: $phone\n"
           . "Email: $email\n"
           . "Wiadomość:\n$message_content";

  // Nagłówki z adresem nadawcy z Twojej domeny
  $headers = "From: kontakt@irondeer.pl\r\n"
           . "Reply-To: $email\r\n"
           . "Content-Type: multipart/mixed; boundary=\"boundary\"\r\n";

  // Treść wiadomości z załącznikiem
  $body = "--boundary\r\n";
  $body .= "Content-Type: text/plain; charset=UTF-8\r\n\r\n";
  $body .= $message . "\r\n";

  // Obsługa załącznika
  if (isset($_FILES["Załącznik"]) && $_FILES["Załącznik"]["error"] === UPLOAD_ERR_OK) {
    $file_tmp = $_FILES["Załącznik"]["tmp_name"];
    $file_name = basename($_FILES["Załącznik"]["name"]);
    $file_type = mime_content_type($file_tmp);
    $file_data = chunk_split(base64_encode(file_get_contents($file_tmp)));

    $body .= "--boundary\r\n";
    $body .= "Content-Type: $file_type; name=\"$file_name\"\r\n";
    $body .= "Content-Disposition: attachment; filename=\"$file_name\"\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $body .= $file_data . "\r\n";
  }

  $body .= "--boundary--";

  // Wysyłka wiadomości
  if (mail($to, $subject, $body, $headers)) {
    header("Location: https://irondeer.pl/?success=true#kontakt");
    exit;
  } else {
    error_log("Mail sending failed to $to from $email at " . date("Y-m-d H:i:s") . "\n", 3, __DIR__ . "/mail_errors.log");
    header("Location: https://irondeer.pl/?error=true#kontakt");
    exit;
  }
}
?>
