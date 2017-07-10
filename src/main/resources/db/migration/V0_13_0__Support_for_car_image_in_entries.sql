ALTER TABLE event_entry ADD COLUMN car_image_url VARCHAR(150) NULL AFTER category_id;

UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499259027/eventEntry/1.png' where id=1;	
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499259049/eventEntry/2.png' where id=2;	
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499421402/eventEntry/3.png' where id=3;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258852/eventEntry/4.png' where id=4;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258907/eventEntry/5.png' where id=5;	
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499269206/eventEntry/6.png' where id=6;	
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258867/eventEntry/7.png' where id=7;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258948/eventEntry/8.png' where id=8;	
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258917/eventEntry/9.png' where id=9;	
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258828/eventEntry/10.png' where id=10;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258842/eventEntry/11.png' where id=11;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499259005/eventEntry/12.png' where id=12;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258975/eventEntry/13.png' where id=13;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258984/eventEntry/14.png' where id=14;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258880/eventEntry/15.png' where id=15;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499259016/eventEntry/16.png' where id=16;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499259061/eventEntry/17.png' where id=17;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258958/eventEntry/18.png' where id=18;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499259039/eventEntry/19.png' where id=19;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258929/eventEntry/20.png' where id=20;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499258939/eventEntry/21.png' where id=21;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=22;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=23;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=63;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=64;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=84;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=85;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=108;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=124;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=129;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=237;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=240;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=264;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=267;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/1.png' where id=417;
UPDATE event_entry set car_image_url = 'https://res.cloudinary.com/msdb-cloud/image/upload/v1499253236/entry/2.png' where id=420;

update
event_entry as ee join 
	(select id, race_number, car_image_url from event_entry where event_edition_id in (select id from event_edition where series_edition_id = 2) and car_image_url is not null) as ee_tmp
	on ee.race_number = ee_tmp.race_number
set ee.car_image_url = ee_tmp.car_image_url;