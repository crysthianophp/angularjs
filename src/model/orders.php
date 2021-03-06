<?php

$data = file_get_contents("php://input");
$data = json_decode($data);
/*echo $data->street;die;
print_r($data);die;*/

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
	try {
		$db = new PDO('mysql:dbname=angularjs;host=localhost', 'root', '');
		$sql = "INSERT INTO orders (name, street, city, zip, country, giftwrap, products) VALUES (?, ?, ?, ?, ?, ?, ?)";
		$result = $db->prepare($sql);
		$result->bindParam(1, $data->name);
		   $result->bindParam(2, $data->street);
		   $result->bindParam(3, $data->city);
		   $result->bindParam(4, $data->zip);
		   $result->bindParam(5, $data->country);
		   $result->bindParam(6, $data->giftwrap);
		   $result->bindParam(7, serialize($data->products));

		$result->execute();
		echo $db->lastInsertId();
		//echo file_get_contents("php://input");
	}catch(PDOException $e) {
		echo 'Error: ' . $e->getMessage();
	}
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
	try {
		$db = new PDO('mysql:dbname=angularjs;host=localhost', 'root', '');
		$query = $db->prepare("SELECT * FROM orders");
		$query->execute();
		$result = $query->fetchAll(PDO::FETCH_ASSOC);

		echo json_encode($result);

	}catch(PDOException $e) {
		echo 'Error: ' . $e->getMessage();
	}
}

