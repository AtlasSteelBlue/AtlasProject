function [ ] = LoadMap(figName)
%Multimedia Cartography (FS 2014)
%
% The Olympic Game - Quiz
%
%--------------------------------------------------------------------------
%
%   LoadMap a background map
%
%--------------------------------------------------------------------------
%
% A game about the Swiss Olympic medal winners. Aim of this game is it, to
% achieve as much as possible points while guessing the "place of birth" of
% the medal winners.
%
%--------------------------------------------------------------------------
%
% Version 1.0                       by Andreas B.G. Baumann (17.3.2014)
%
%--------------------------------------------------------------------------

% WMS-Request: Deactivated because of time delay!!!!
%
% mapURLLandsat = ['http://wms.geo.admin.ch/?SERVICE=WMS'...
%                  '&REQUEST=GetMap'...
%                  '&VERSION=1.1.0'...
%                  '&LAYERS=ch.swisstopo.images-landsat25'...
%                  '&STYLES=default&SRS=EPSG:4326'...
%                  '&BBOX=5.8,45.6,10.8,47.9'...
%                  '&WIDTH=1200'...
%                  '&HEIGHT=900'...
%                  '&FORMAT=image/png'];
%              
% [landsat,R] = wmsread(mapURLLandsat);

% Load image data and rotation matrix
landsat = cell2mat(struct2cell(load('data\Orthophoto\landsat129.mat')));
R = cell2mat(struct2cell(load('data\Orthophoto\landsat_R129.mat')));

% open a new figure
figure('name',figName);

% draw the map
geoshow(landsat, R, 'DisplayType', 'texturemap');
axis equal

end

