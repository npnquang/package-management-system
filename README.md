# 1. Routing table

| Name                       | Endpoint                                | HTTP Method | Purpose                                                            | Handler                   | Example URL                                                         |
| -------------------------- | --------------------------------------- | ----------- | ------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------- |
| Render Drivers             | `/32963742/James/driver/list`           | GET         | Return the HTML that requests the data from server                 | `renderDrivers`           | `localhost:8080/32963742/James/list`                                |
| Render Add Driver Form     | `/32963742/James/driver/add`            | GET         | Return the form that lets user submit a new driver                 | `renderAddDriverForm`     | `localhost:8080/32963742/James/add`                                 |
| Add New Driver             | `/32963742/James/driver/add-driv/er`    | POST        | Handle the request to add a new driver                             | `addNewDriver`            | `localhost:8080/32963742/James/add-driver`                          |
| Render Delete Driver Form  | `/32963742/James/driver/delete`         | GET         | Return the form to let user delete the driver                      | `renderDeleteDriverForm`  | `localhost:8080/32963742/James/delete`                              |
| Delete Driver Button       | `/32963742/James/driver/delete-button`  | DELETE      | Handle the request to delete the driver from the button            | `deleteDriverButton`      | `localhost:8080/32963742/James/delete-button?id=D58-32-YYT`         |
| Delete Driver Form         | `/32963742/James/driver/delete-form`    | GET         | Handle the request to delete the driver from the form              | `deleteDriverForm`        | `localhost:8080/32963742/James/delete-form?id=D58-32-YYT`           |
| Filter Driver              | `/32963742/James/driver/department`     | GET         | Handle the request to filter the drivers based on their department | `filterDriver`            | `localhost:8080/32963742/James/department`                          |
| Render Packages            | `/32963742/James/package/list`          | GET         | Return the HTML that requests the data from server                 | `renderPackages`          | `localhost:8080/32963742/James/package/list`                        |
| Render Add Package Form    | `/32963742/James/package/add`           | GET         | Return the form that lets user submit a new package                | `renderAddPackageForm`    | `localhost:8080/32963742/James/package/add`                         |
| Add New Package            | `/32963742/James/package/add-package`   | POST        | Handle the request to add a new package                            | `addNewPackage`           | `localhost:8080/32963742/James/package/add-package`                 |
| Render Delete Package Form | `/32963742/James/package/delete`        | GET         | Return the form to let user delete the package                     | `renderDeletePackageForm` | `localhost:8080/32963742/James/package/delete`                      |
| Delete Package Button      | `/32963742/James/package/delete-button` | DELETE      | Handle the request to delete the package from the button           | `deletePackageButton`     | `localhost:8080/32963742/James/package/delete-button?id=POZ-JN-727` |
| Delete Package Form        | `/32963742/James/package/delete-form`   | GET         | Handle the request to delete the package from the form             | `deletePackageForm`       | `localhost:8080/32963742/James/package/delete-form?id=POZ-JN-727`   |
| Invalid URL                | `/32963742/James/error`                 | GET         | Render the 404 error page                                          | `renderErrorPage`         | `localhost:8080/32963742/James/error`                               |
| Invalid Data               | `/32963742/James/invalid-data`          | GET         | Render the invalid data page                                       | `renderInvalidDataPage`   | `localhost:8080/32963742/James/invalid-data`                        |
| Catch-All                  | `/32963742/James/*`                     | GET         | Redirect to the error page for any other URLs                      | `redirect404`             | `localhost:8080/32963742/James/any-other-url`                       |
| Base Page                  | `/32963742/James/`                      | GET         | Redirect to the base page                                          | `renderIndex`             | `localhost:8080/32963742/James/`                                    |

# 2. Steps to run the code

After downloading the `.zip` file and unzip it, please run the following commands:

### 1. To install the dependencies:
```
npm install
```

### 2. To launch the server
```
nodemon server.js
```
