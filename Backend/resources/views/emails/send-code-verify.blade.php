<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác thực tài khoản</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding: 40px 0;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="400" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
                    <tr>
                        <td style="background-color: #4f46e5; padding: 20px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0; font-size: 24px;">Xác thực Email</h2>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 30px; text-align: center;">
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
                                Chào bạn,<br>
                                Cảm ơn bạn đã đăng ký. Vui lòng sử dụng mã bên dưới để hoàn tất quá trình xác thực:
                            </p>
                            
                            <div style="background-color: #f3f4f6; border: 2px dashed #4f46e5; border-radius: 6px; padding: 15px; display: inline-block;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
                                    {{ $code }}
                                </span>
                            </div>
                            
                            <p style="color: #9ca3af; font-size: 13px; margin-top: 25px;">
                                Mã này sẽ hết hạn trong vòng 2 phút. Nếu bạn không yêu cầu mã này, hãy bỏ qua email này.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f9fafb; padding: 15px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #6b7280; font-size: 12px;">
                                © {{ date('Y') }} Tên Thương Hiệu Của Bạn. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>