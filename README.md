# ticTac

Inside NGINX conf file, Add these lines:
server {
        listen       81;
        server_name  tictac;
        root   D:/Workstation/projects/ticTac/;
        index  index.html index.htm;
        
        location /login-service/ {
            proxy_pass http://localhost:8000/;
            proxy_redirect off;
        }

        location /home/ {
            root   D:/Workstation/projects/ticTac/;
            index  index.html index.htm;
        }

        
    }
