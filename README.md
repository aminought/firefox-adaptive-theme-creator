A Firefox extension that allows you to create a unique adaptive theme for your browser.
https://addons.mozilla.org/en-US/firefox/addon/favicon-color

## Here's what it might look like

https://github.com/user-attachments/assets/4c629efe-bccd-4e0c-be9b-59447f779e5f

There are many features in this extension, so I have decided to create separate videos for each one.

## Enabling and disabling the coloring of a specific part of the browser.

You can turn the coloring of a specific part of the browser on or off by clicking on it with the left mouse button.

https://github.com/user-attachments/assets/bffe39c0-b1aa-466a-a93c-d2a5fe60126e

## Color sources

There are 3 color sources: **page**, **favicon** and **own color**.

https://github.com/user-attachments/assets/b9819ccf-08ce-4c30-80bb-6f657b0600ad

**Page** and **favicon** colors can be calculated with 2 similar, but different algorithms: **Basic** and **K-means**. 

**Basic**: The number of pixels for each color is calculated, and the color with the highest number of pixels is chosen.

**K-means**: The number of pixels for each color is calculated. Then, all the colors are clustered using [K-means](https://en.wikipedia.org/wiki/K-means_clustering). The cluster with the highest number of pixels is selected. Finally, the color with the most pixels in this cluster is chosen.

In the video, you can see that the simple algorithm makes a mistake about the color. This is because brown takes up more pixels than each shade of green, but the K-means algorithm divides brown and shades of green into different clusters. As a result, green is more common and therefore wins.

https://github.com/user-attachments/assets/4621bb50-2dd3-422f-96fc-3aca9b3216f5

## Color options

There are 3 options to change: **saturation limit** like in Vivaldi Browser, **darkness** and **brightness**.

https://github.com/user-attachments/assets/2c2d4911-08e4-4174-8879-9bf7fb75090a

## Context menu

There are 6 parts of the browser that have their own settings that can be changed independently of the global settings: **Frame**, **Selected Tab**, **Toolbar**, **Toolbar Field**, **Sidebar** and **Popup**.

By right-clicking on any part in the browser preview, you can access the context menu. This allows you to override global settings and make changes to individual parts of the browser.

https://github.com/user-attachments/assets/bb34af35-8eb9-4c92-b84d-259f57adfb8c

Each part of the browser has connected ones that change in the same context menu, and you can select them by clicking on the context menu header. They may inherit global settings or the settings of other parts, or they may not inherit anything at all.

https://github.com/user-attachments/assets/5b2d7ee7-7f21-4587-ab2f-82bdf38b486c


