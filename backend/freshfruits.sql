---- CONSTRAINTS TABLES ----

CREATE TABLE user_roles (
	role VARCHAR(20) PRIMARY KEY
)

INSERT INTO user_roles VALUES
	('ADMIN'),
	('CUSTOMER')

CREATE TABLE user_statuses (
	status VARCHAR(20) PRIMARY KEY
)

INSERT INTO user_statuses VALUES 
	('ACTIVE'),
	('INACTIVE')

CREATE TABLE order_statuses (
	status VARCHAR(20) PRIMARY KEY
)

INSERT INTO order_statuses VALUES 
	('PENDING'),
	('CONFIRMED'),
	('DELIVERED'),
	('CANCELLED')


CREATE TABLE payment_statuses (
	status VARCHAR(20) PRIMARY KEY
)

INSERT INTO payment_statuses VALUES
	('PENDING'),
	('SUCCEED'),
	('FAILED')


CREATE TABLE delivery_statuses (
	status VARCHAR(20) PRIMARY KEY
)

INSERT INTO delivery_statuses VALUES 
	('PENDING'),
	('SCHEDULED'),
	('OUT FOR DELIVERY'),
	('DELIVERED')	

----------------------------
create extension if not exists "uuid-ossp"

CREATE TABLE users (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	first_name VARCHAR(20), 
	last_name VARCHAR(20),
	email VARCHAR(50) NOT NULL,
	phone CHAR(8),
	"password" VARCHAR(255) NOT NULL,
	"role" VARCHAR(20) DEFAULT 'CUSTOMER',
	status VARCHAR(20) DEFAULT 'ACTIVE',
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fk_status FOREIGN KEY (status) REFERENCES user_statuses(status),
	CONSTRAINT fk_role FOREIGN KEY ("role") REFERENCES user_roles ("role")
)
	
CREATE TABLE fruits (
	id SERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(20) NOT NULL,
	description VARCHAR(255),
	image VARCHAR(255),
	price FLOAT(24) NOT NULL,
	quantity INTEGER NOT NULL,
	sold INTEGER NOT NULL DEFAULT 0,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
)

INSERT INTO fruits (name,description,image, price,quantity) VALUES
('Apple', 'China Fuji Apples', 'public/uploads/1729752708886-apple.jpeg', 1.00, 30),
('Orange', 'Sunkist Australia Navel Orange', 'public/uploads/1729753140211-orange.jpg', 1.50, 25),
('Banana', 'Sumifru Kamsookwang Banana', 'public/uploads/1729745170107-banana.jpeg', 2.00, 40)

CREATE TABLE cart (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID NOT NULL,
	subtotal FLOAT(24),
	total FLOAT(24),
	quantity INTEGER,
	CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(uuid)
)

CREATE TABLE cart_items (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	cart_id uuid NOT NULL,
	fruit_id SERIAL,
	quantity INTEGER,
	subtotal FLOAT(24),
	CONSTRAINT fk_cart_id FOREIGN KEY (cart_id) REFERENCES cart(uuid),
	CONSTRAINT fk_fruit_id FOREIGN KEY (fruit_id) REFERENCES fruits(id)
)

CREATE TABLE payments (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	payment_method VARCHAR(20),
	payment_amount FLOAT(24) NOT NULL,
	status VARCHAR(20) DEFAULT 'PENDING',
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
)


CREATE TABLE delivery (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	delivery_method VARCHAR(20),
	delivery_date TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '3 days'),
	delivery_address VARCHAR(255),
	status VARCHAR(20) DEFAULT 'PENDING',
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW()
)

CREATE TABLE orders (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	user_id UUID NOT NULL,
	subtotal FLOAT(24),
	discount FLOAT(24),
	delivery FLOAT(24),
	total FLOAT(24),
	payment_id UUID,
	delivery_id UUID,
	status VARCHAR(20) DEFAULT 'PENDING',
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(uuid),
	CONSTRAINT fk_payment_id FOREIGN KEY (payment_id) REFERENCES payments(uuid),
	CONSTRAINT fk_delivery_id FOREIGN KEY (delivery_id) REFERENCES delivery(uuid)
)

CREATE TABLE order_items (
	uuid UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
	order_id UUID NOT NULL,
	fruit_id SERIAL NOT NULL,
	quantity INTEGER NOT NULL,
	subtotal FLOAT(24) NOT NULL,
	created_at TIMESTAMP DEFAULT NOW(),
	updated_at TIMESTAMP DEFAULT NOW(),
	CONSTRAINT fk_order_id FOREIGN KEY (order_id) REFERENCES orders(uuid),
	CONSTRAINT fk_fruit_id FOREIGN KEY (fruit_id) REFERENCES fruits(id)
)

-- DROP TABLE delivery
-- DROP TABLE payments
-- DROP TABLE order_items
-- DROP TABLE orders
-- DROP TABLE cart_items
-- DROP TABLE cart
-- DROP TABLE users
-- DROP TABLE fruits
