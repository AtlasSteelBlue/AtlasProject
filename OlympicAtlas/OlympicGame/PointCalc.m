function [ point ] = PointCalc( dist )
%Multimedia Cartography (FS 2014)
%
% The Olympic Game - Quiz
%
%--------------------------------------------------------------------------
%
%   Calculation of the achieved points
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

if dist >= 100                          % if distance is bigger than 100 km
    point = 0;                          
else
   	point = ( 100 - dist ) * 5;         % [min = 0, max = 500]
end

end

