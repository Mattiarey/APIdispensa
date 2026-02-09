-- Queste sono query da fare serverside, ovviamente aggiustare tuttecose per il server
CREATE USER 'api_user'@'localhost' IDENTIFIED BY 'Sc3moscm0?';
GRANT SELECT, INSERT, UPDATE, DELETE ON home_stuff.* TO 'api_user'@'localhost';
FLUSH PRIVILEGES;