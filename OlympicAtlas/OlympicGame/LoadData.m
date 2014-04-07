function [ medalist, j ] = LoadData( )
%Multimedia Cartography (FS 2014)
%
% The Olympic Game - Quiz
%
%--------------------------------------------------------------------------
%
%   Load data of Olympic games winner
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

% Import data of xls-File
[~,~,swissMedal] = xlsread('data\OlympicGames.xlsx','Swiss Medal Winner');

[m,~] = size(swissMedal);
j = 0;

for i=2:m
    if iscellstr(swissMedal(i,4))           % Skip all NaN in the "place of 
        medalist(j+1,:) = swissMedal(i,:);  % birth" column
        j = j+1;
    end
end

end

